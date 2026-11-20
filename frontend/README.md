# Frontend

This will be the Luxurious Bath Studio catalogue and showroom website.

It uses Vite, vanilla TypeScript, and the small custom JSX runtime in `minimal-jsx/` - it does not use React.

## Start locally

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

## Current status

The Vite and custom JSX foundations are in place. The homepage is now a branded showroom catalogue prototype; the remaining product, account, and payment flows are still placeholders.

The current text-only wordmark is temporary. Replace it with the client-approved logo asset when it is supplied.

The multi-page Vite map is now connected:

- `/` and `/pages/shopping.html` - storefront/catalogue prototype
- `/pages/cart.html` - enquiry selection page
- `/pages/payment.html` - payment hand-off page
- `/pages/profile.html` - saved projects/profile page
- `/pages/auth.html` - sign-in page

## Planned structure

```text
src/
  main.tsx          app entry point only
  components/       header, product card, enquiry drawer, footer
  pages/            catalogue, product detail, studio/contact pages
  data/             API client and UI-facing product types
  style/            shared tokens and component styles
minimal-jsx/        custom JSX runtime
```

## Formatting

Use Prettier before committing frontend work:

```powershell
npm run format
npm run format:check
```

Frontend organization is intentional: `src/scripts/` contains page behavior,
`src/styles/` contains CSS, `src/templates/` contains reusable JSX templates,
and `pages/` contains the five HTML entry pages.

The hero owns catalogue search; the shopping route owns the full filtered
product grid. Keep all new JSX in `src/templates/` unless it is a tiny
page-bootstrap fragment.

## Design direction

The UI will be an image-led luxury bathroom catalogue inspired by the Kohler price book: restrained typography, warm stone tones, spacious layouts, product codes, and a clear “visit the Jaipur studio” call to action.

The website will eventually read product images from the Django API. Locally, images are served by Django at `http://127.0.0.1:8000/media/...`; in production they will come from the Cloudflare CDN.

## Running the integrated demo

Start Django from `backend/`, then Vite from `frontend/`:

```powershell
# backend
.\.venv\Scripts\python.exe manage.py runserver

# frontend
npm run dev
```

Vite proxies `/api` and `/media` to Django. The homepage reads live products from `/api/products/`; it falls back to a small demo set if Django is unavailable.

The shopping route supports live search and category filters. Adding an item requires an account and stores it in the Django cart; account, profile, enquiry, and payment pages are available under `pages/`.
