# Backend

The backend is a Django API for the Luxurious Bath Studio catalogue, cart, and orders.

## Start locally

```powershell
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

Create a `.env` from `.env.example` and fill in the PostgreSQL connection values before running migrations.

## Product catalogue workflow

The supplier PDF and generated data stay in `output/`, which is ignored by Git.

```text
output/Kohler_PriceBook_June_2026.pdf
        ↓
scripts/extract_kohler_pricebook.py
        ↓
output/kohler_products.json
```

Run the catalogue extractor:

```powershell
.\.venv\Scripts\python.exe scripts\extract_kohler_pricebook.py output\Kohler_PriceBook_June_2026.pdf
```

The generated JSON is a review draft. It preserves the source PDF page and raw row text, so do not import it into PostgreSQL without catalogue review.

After catalogue approval, import it with:

```powershell
.\.venv\Scripts\python.exe scripts\import_kohler_catalogue.py output\kohler_products.json
```

The importer upserts products by `catalogue_id`. It creates a product requirement only if both referenced product codes are already in PostgreSQL; unresolved accessory codes are reported and skipped.

## Payments

Payment initialization and verification are account-based:

- `POST /api/payments/init/` creates a Razorpay order from the authenticated user's server-side cart.
- `POST /api/payments/verify/` verifies Razorpay's payment signature before confirming the local order.

The browser must never receive `RAZORPAY_KEY_SECRET`. Add Razorpay test keys to `.env` before testing checkout. Webhook verification remains a production follow-up when the public domain and `RAZORPAY_WEBHOOK_SECRET` are available.

Each draft product also includes `suggested_product_codes` and
`required_product_codes` in `details`. The latter is populated only from
explicit “Must order” notes and is also emitted as `product_requirements` at
the top level, ready to map to the `ProductRequirements` table after both
product codes have been reviewed and imported.

## Product images

Supplier images are extracted into `media/products/kohler/`, also ignored by Git.

```powershell
.\.venv\Scripts\python.exe scripts\extract_kohler_images.py output\Kohler_PriceBook_June_2026.pdf
```

During development, Django serves those files under `/media/`. In production, selected product images should be uploaded to Cloudflare R2 and their final CDN URL saved in `ProductImage.url`.

The catalogue extractor maps an image automatically only where a PDF page has one imported product. Other rows contain `image_candidates` and an `image_mapping_status` of `needs_review` in the generated JSON, preventing accidental product-image mismatches.

## Important folders

- `apps/products/` - products, categories, inventory, and product images
- `apps/cart/` - active shopping carts
- `apps/orders/` - order records and line items
- `scripts/` - supplier catalogue extraction tools
- `output/` - ignored source PDFs and generated drafts
- `media/` - ignored local image assets
