# Project handoff

## Current state

- Django backend, PostgreSQL configuration, and Vite/custom-JSX frontend are present.
- PostgreSQL currently contains 87 imported Kohler products across 16 categories and 1 resolved product requirement.
- Kohler PDF extraction produces an ignored JSON review draft in `backend/output/`.
- PDF product references are captured as suggestions; explicit “Must order” references are emitted as `product_requirements` for the `ProductRequirements` table.
- 1,412 embedded PDF images have been extracted to ignored local media in `backend/media/products/kohler/`.
- All imported products have a local-media image mapping. 70 are automatic PDF table-row matches; the remaining mappings are provisional nearest-row matches to review later.
- The homepage and shopping route now show the Luxurious Bath Studio showroom prototype.
- The frontend loads the live Django product catalogue from `/api/products/` through Vite's local proxy, with a small offline fallback for demos.
- Razorpay account-based order initiation and signature verification endpoints exist. The order migration is applied; test keys are still required in `.env` before checkout can be exercised.
- Account registration/login/session/logout and an authenticated server-side cart are available. The frontend now has functional catalogue search/filter, account, enquiry, and payment-init pages.
- Frontend formatting uses Prettier (`npm run format` / `npm run format:check`). Keep scripts in `frontend/src/scripts/`, CSS in `frontend/src/styles/`, reusable JSX in `frontend/src/templates/`, and HTML routes in `frontend/pages/`.
- The catalogue search control is in the hero; product-card and storefront JSX live in `src/templates/catalogue/`. Run Prettier after every frontend change.

## Key decisions

- Do not import extracted supplier rows to PostgreSQL without review: PDF text layout is inconsistent.
- The approved draft was imported on this handoff. 46 requirement references remain unresolved because their accessory codes are not yet imported as products.
- Local media is served at `/media/` only in Django development. Future production images go to Cloudflare R2/CDN and the resulting URL is stored in `ProductImage.url`.
- The current frontend wordmark is temporary. Replace it with the client-provided official logo; no verified Jaipur logo was found online.

## Next recommended work

1. Review the product JSON, clean names/categories, then add a safe Django import command.
2. Match the selected local product images to product codes and upload approved files to Cloudflare R2.
3. Replace static homepage cards with API data and implement product detail, enquiry, authentication, and profile flows.
4. Add a product-image uploader and an API endpoint for the frontend.

## Verification

- `npm run build` from `frontend/` succeeds.
- `python manage.py check` from `backend/` succeeds.
