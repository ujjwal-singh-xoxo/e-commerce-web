#!/usr/bin/env python3
"""Import an approved Kohler extraction draft into Django/PostgreSQL."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import django
from django.db import transaction

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.products.models import Product, ProductCategory, ProductImage, ProductRequirements  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Import approved Kohler catalogue JSON.")
    parser.add_argument("catalogue", type=Path)
    args = parser.parse_args()
    payload = json.loads(args.catalogue.read_text(encoding="utf-8"))
    skipped: list[dict[str, str]] = []

    with transaction.atomic():
        for row in payload["products"]:
            category, _ = ProductCategory.objects.get_or_create(category_name=row["category"])
            product, _ = Product.objects.update_or_create(
                catalogue_id=row["catalogue_id"],
                defaults={
                    "category": category,
                    "name": row["name"],
                    "description": row["description"],
                    "mrp": row["mrp"],
                    "selling_price": row["selling_price"],
                    "details": row["details"],
                    "is_active": True,
                },
            )
            if row.get("image_url"):
                ProductImage.objects.update_or_create(
                    product=product,
                    is_primary=True,
                    defaults={"url": row["image_url"]},
                )

        by_code = {item.catalogue_id: item for item in Product.objects.all()}
        imported = 0
        for edge in payload.get("product_requirements", []):
            product = by_code.get(edge["product_catalogue_id"])
            requirement = by_code.get(edge["requirement_catalogue_id"])
            if not product or not requirement:
                skipped.append(edge)
                continue
            ProductRequirements.objects.get_or_create(product=product, requirement=requirement)
            imported += 1

    print(f"Imported or updated {len(payload['products'])} products.")
    print(f"Created or retained {imported} product requirements.")
    print(f"Skipped {len(skipped)} unresolved product requirements.")


if __name__ == "__main__":
    main()
