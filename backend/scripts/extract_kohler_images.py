#!/usr/bin/env python3
"""Extract embedded price-book images into local Django media storage.

This deliberately creates a page-level manifest instead of guessing which
picture belongs to which product. Match the assets during catalogue review,
then upload the selected files to Cloudflare R2 and save the CDN URL in
ProductImage.url.

Usage (from backend/):
    .\\.venv\\Scripts\\python.exe scripts\\extract_kohler_images.py \\
      output\\Kohler_PriceBook_June_2026.pdf
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from pypdf import PdfReader


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract embedded Kohler PDF images.")
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--output", type=Path, default=Path("media/products/kohler"))
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, str | int]] = []
    reader = PdfReader(args.pdf)
    for page_number, page in enumerate(reader.pages, start=1):
        positions: dict[str, list[float]] = {}

        def capture_image_position(operator: bytes, operands: list[object], cm: list[float], _tm: list[float]) -> None:
            if operator == b"Do" and operands and str(operands[0]).startswith("/Im"):
                positions[str(operands[0])] = [float(value) for value in cm]

        page.extract_text(visitor_operand_before=capture_image_position)
        for image_number, (_resource_key, image) in enumerate(page.images.items(), start=1):
            resource_name = "/" + image.name.split(".", maxsplit=1)[0]
            suffix = image.name.rsplit(".", maxsplit=1)[-1].lower()
            filename = f"page-{page_number:03d}-image-{image_number:02d}.{suffix}"
            path = args.output / filename
            path.write_bytes(image.data)
            manifest.append(
                {
                    "source_page": page_number,
                    "filename": filename,
                    "local_url": f"/media/products/kohler/{filename}",
                    "width": image.image.width,
                    "height": image.image.height,
                    "x": positions.get(resource_name, [0, 0, 0, 0, 0, 0])[4],
                    "y": positions.get(resource_name, [0, 0, 0, 0, 0, 0])[5],
                    "rendered_width": positions.get(resource_name, [0, 0, 0, 0, 0, 0])[0],
                    "rendered_height": positions.get(resource_name, [0, 0, 0, 0, 0, 0])[3],
                }
            )

    manifest_path = args.output / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Extracted {len(manifest)} images to {args.output}")


if __name__ == "__main__":
    main()
