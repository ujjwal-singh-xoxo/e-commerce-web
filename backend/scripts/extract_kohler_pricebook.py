#!/usr/bin/env python3
"""Extract Kohler's tabular price book into Product-model-shaped JSON.

Usage:
    uv run --directory backend python scripts/extract_kohler_pricebook.py \
      "C:\\path\\to\\Kohler_PriceBook (June'26).pdf" --output output/kohler_products.json

The output is deliberately an import *draft*: every product keeps its PDF page
and raw table text in ``details`` so suspicious rows can be reviewed before
being inserted into the database.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from decimal import Decimal
from pathlib import Path
from typing import Any

from pypdf import PdfReader


CODE = re.compile(r"\bK-[A-Z0-9]+(?:-[A-Z0-9]+)+\b", re.IGNORECASE)
PRICE = re.compile(r"(?:MRP\s*)?[₹Rs.\s]*([0-9][0-9,]*\.\d{2})", re.IGNORECASE)
IGNORE = {"MODEL", "DESCRIPTION", "CODE", "MRP", "MAIN MENU"}
MUST_ORDER = re.compile(r"must\s*(?:or\s*)?der(?:\s+with)?\s*[:\-]?", re.IGNORECASE)


def clean(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\u00ae", "").replace("™", "")).strip()


def related_codes(raw_row: str, product_code: str) -> tuple[list[str], list[str]]:
    """Return suggested codes and mandatory codes referenced by a catalogue row."""
    suggestions = sorted({code.upper() for code in CODE.findall(raw_row)} - {product_code})
    required: set[str] = set()
    for instruction in MUST_ORDER.split(raw_row)[1:]:
        required.update(code.upper() for code in CODE.findall(instruction))
    return suggestions, sorted(required - {product_code})


def page_fragments(page: Any) -> list[tuple[float, float, str]]:
    """Return visual lines, preserving x-position for the four table columns."""
    fragments: list[tuple[float, float, str]] = []

    def capture(text: str, _cm: Any, tm: Any, _font: Any, _size: Any) -> None:
        text = clean(text)
        if text:
            fragments.append((round(float(tm[5]), 1), float(tm[4]), text))

    page.extract_text(visitor_text=capture)
    return fragments


def page_lines(page: Any) -> list[tuple[float, list[str]]]:
    grouped: dict[float, list[tuple[float, str]]] = defaultdict(list)
    for y, x, text in page_fragments(page):
        grouped[y].append((x, text))
    return [(y, [text for _, text in sorted(parts)]) for y, parts in sorted(grouped.items(), reverse=True)]


def category_from(lines: list[tuple[float, list[str]]], previous: str) -> str:
    # Kohler places the family heading above each table (e.g. TOILETS / Smart Toilets).
    candidates: list[str] = []
    for _y, parts in lines[:20]:
        value = clean(" ".join(parts))
        if not value or value.upper() in IGNORE or "MRP" in value.upper():
            continue
        if value.isupper() and len(value) < 40 and not CODE.search(value) and not any(ch.isdigit() for ch in value):
            candidates.append(value.title())
    return candidates[-1] if candidates else previous


def extract_page(page: Any, page_number: int, category: str) -> list[dict[str, Any]]:
    fragments = page_fragments(page)
    width = float(page.mediabox.width)
    # The PDF uses Model | Description | Code | MRP. Only accept a code in the
    # third column - references to component codes in descriptions are excluded.
    code_positions = [(y, x, CODE.search(text)) for y, x, text in fragments if x >= width * 0.65]
    code_positions.sort(key=lambda item: item[0], reverse=True)
    records: list[dict[str, Any]] = []
    for index, (y, _x, match) in enumerate(code_positions):
        if not match:
            continue
        code = match.group(0).upper()
        next_code_y = code_positions[index + 1][0] if index + 1 < len(code_positions) else y - 170
        row = [(line_y, x, text) for line_y, x, text in fragments if next_code_y < line_y <= y + 70]
        price_match = next((PRICE.search(text) for _line_y, x, text in row if x >= width * 0.80 and PRICE.search(text)), None)
        if not price_match:
            continue
        amount = Decimal(price_match.group(1).replace(",", ""))
        model = clean(" ".join(text for _line_y, x, text in row if x < width * 0.20 and text.upper() not in IGNORE))
        context = [text for _line_y, x, text in row if x < width * 0.70 and text.upper() not in IGNORE and "MRP" not in text.upper()]
        description = clean(" ".join(context))
        description = clean(description.replace(code, ""))
        name = model[:256] or description.split(" with ", 1)[0].split(" - ", 1)[0][:256] or code
        suggested_codes, required_codes = related_codes(description, code)
        records.append(
            {
                "catalogue_id": code,
                "category": category or "Uncategorised",
                "name": name,
                "description": description or name,
                "mrp": str(amount),
                "selling_price": str(amount),
                "image_url": None,
                "details": {
                    "source_page": page_number,
                    "source_row_y": y,
                    "raw_row": description,
                    "suggested_product_codes": suggested_codes,
                    "required_product_codes": required_codes,
                },
            }
        )
    return records


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract a Kohler price book to Product JSON.")
    parser.add_argument("pdf", type=Path, help="Price book PDF")
    parser.add_argument("--output", type=Path, default=Path("output/kohler_products.json"))
    parser.add_argument("--image-manifest", type=Path, default=Path("media/products/kohler/manifest.json"))
    args = parser.parse_args()
    reader = PdfReader(args.pdf)
    category = "Uncategorised"
    products: dict[str, dict[str, Any]] = {}
    for page_number, page in enumerate(reader.pages, start=1):
        lines = page_lines(page)
        category = category_from(lines, category)
        for product in extract_page(page, page_number, category):
            products[product["catalogue_id"]] = product

    # Product images are drawn in the first column of each table. Match their
    # PDF y-coordinate to the code row's y-coordinate, not extraction order.
    images_by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    if args.image_manifest.exists():
        for image in json.loads(args.image_manifest.read_text(encoding="utf-8")):
            if image.get("width", 0) >= 80 and image.get("height", 0) >= 80:
                images_by_page[int(image["source_page"])].append(image)
    products_by_page: dict[int, list[dict[str, Any]]] = defaultdict(list)
    for product in products.values():
        products_by_page[product["details"]["source_page"]].append(product)
    for page, page_products in products_by_page.items():
        candidates = sorted(images_by_page[page], key=lambda image: image["width"] * image["height"], reverse=True)
        urls = [image["local_url"] for image in candidates]
        for product in page_products:
            product["details"]["image_candidates"] = urls
            product["details"]["image_mapping_status"] = "needs_review"
            row_images = [
                image for image in candidates
                if image.get("x", 0) < 180
                and abs((image.get("y", 0) + image.get("rendered_height", 0) / 2) - product["details"]["source_row_y"]) < 90
            ]
            if row_images:
                selected = max(row_images, key=lambda image: image["rendered_width"] * image["rendered_height"])
                product["image_url"] = selected["local_url"]
                product["details"]["image_mapping_status"] = "automatic_position_match"
            elif candidates:
                # The table sometimes uses a slightly different x-position or
                # row height. Keep the nearest image as a provisional 1:1
                # mapping so the storefront remains fully populated.
                selected = min(
                    candidates,
                    key=lambda image: abs(
                        (image.get("y", 0) + image.get("rendered_height", 0) / 2)
                        - product["details"]["source_row_y"]
                    ),
                )
                product["image_url"] = selected["local_url"]
                product["details"]["image_mapping_status"] = "provisional_nearest_row_match"
    relationships = [
        {"product_catalogue_id": product["catalogue_id"], "requirement_catalogue_id": requirement}
        for product in products.values()
        for requirement in product["details"]["required_product_codes"]
    ]
    payload = {
        "source": args.pdf.name,
        "product_count": len(products),
        "product_requirement_count": len(relationships),
        "product_requirements": relationships,
        "products": list(products.values()),
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(products)} products to {args.output}")


if __name__ == "__main__":
    main()
