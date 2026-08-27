# Fox Orthotics E-Commerce

A full-stack e-commerce platform for the Fox Orthotics product catalogue. The repository contains a React storefront, a separate administration dashboard, an Express API, Firebase Cloud Functions packaging, Firestore rules, deployment configuration, product data, and the complete product-image library.

## What is included

- Customer storefront with product discovery, category and attribute filters, search, sorting, product details, comparisons, wishlist, and persistent cart
- Dealer, contact, policy, authentication, and account-facing pages
- Embedded administration routes plus a standalone admin dashboard
- Product, user, authentication, order, review, image, and AI-assistance API modules
- Firestore, Firebase Storage, Firebase Realtime Database, Hosting, and Cloud Functions configuration
- Razorpay, SendGrid, Gemini, Groq, reCAPTCHA, and WhatsApp integration points
- 123 product records and images for 100+ product/SKU folders

## Technology

| Area | Stack |
| --- | --- |
| Storefront | React 19, TypeScript, Vite 6, React Router, Tailwind CSS |
| Admin dashboard | React 19, TypeScript, Vite 7, Firebase |
| API | Node.js 20, Express, Firebase Admin, Firestore |
| Cloud | Firebase Hosting, Cloud Functions, Firestore, Storage |
| Integrations | Razorpay, SendGrid, Gemini, Groq, reCAPTCHA, WhatsApp |

## Repository structure

```text
.
├── frontend/src/                 Storefront source and embedded admin routes
├── Fox-Orthotics-Admin/          Standalone admin dashboard
├── backend/server/               Express API and migration/maintenance scripts
├── backend/functions/            Firebase Functions wrapper and packaged server source
├── config/                       Render and Firebase reference configuration
├── data/                         Product catalogue and metadata
├── database/                     Firestore, Storage, and Realtime Database rules
├── public/                       Product images, logos, products JSON, SEO files
├── scripts/                      Build, migration, image, and deployment utilities
├── firebase.json                 Firebase deployment configuration
├── package.json                  Storefront dependencies and workspace scripts
└── vite.config.ts                Storefront development/build configuration
```

`dist/`, dependency directories, Firebase caches, local environment files, and service-account keys are intentionally excluded from version control.

## Prerequisites

- Node.js 20 LTS
- npm 9 or newer
- Git
- Git LFS for the product-image catalogue
- A Firebase project for cloud-backed features
- Firebase CLI for emulator or deployment workflows

## Local setup

### 1. Clone and configure the storefront

```bash
git clone https://github.com/aarushi787/Orthotics-E-Commerce-Main.git
cd Orthotics-E-Commerce-Main
git lfs pull
cp .env.example .env
npm ci
npm run dev
```

The storefront runs at `http://localhost:3000`. If the API is unavailable, the application falls back to `public/products.json` for catalogue data.

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

### 2. Start the API

```bash
cd backend/server
cp .env.example .env
npm ci
npm run dev
```

The API runs at `http://localhost:5000`. Verify it with `GET /health`.

For local Firebase Admin access, place a downloaded service-account file at `backend/server/serviceAccountKey.json`. This filename is ignored by Git. In Google-managed environments, Application Default Credentials can be used instead.

### 3. Start the standalone admin dashboard

```bash
cd Fox-Orthotics-Admin
npm ci
npm run dev
```

Vite prints the selected local URL, normally `http://localhost:5173`.

## Environment variables

Use the committed example files as templates:

- Root `.env.example`: browser-safe storefront configuration
- `Fox-Orthotics-Admin/.env.example`: standalone admin Firebase configuration
- `backend/server/.env.example`: server-only credentials and integration configuration

Never place server secrets in variables prefixed with `VITE_`; Vite exposes those values to browser code. Never commit `.env` files or Firebase service-account JSON files.

Important server variables include:

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Signs authentication tokens |
| `FIREBASE_STORAGE_BUCKET` | Selects the Firebase Storage bucket |
| `GEMINI_API_KEY` | Enables AI-assisted backend features |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Enables payment integration |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeds or configures administrative access where supported |

## Commands

Run these from the repository root unless a different directory is shown.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the storefront development server |
| `npm run build` | Build the storefront into `dist/` |
| `npm run preview` | Preview the storefront production build |
| `npm run build:admin` | Build the standalone admin dashboard |
| `npm run prepare:admin` | Copy the admin build into `dist/admin/` |
| `npm run prepare:functions` | Refresh the server source packaged for Cloud Functions |
| `npm run build:all` | Build storefront/admin and prepare Functions |
| `npm run optimize:images` | Run the image-optimization utility |
| `npm run migrate:products:dry-run` | Preview the product migration |
| `npm run migrate:products` | Run the product migration |
| `npm run set:sendgrid-secret` | Configure the SendGrid Firebase secret |
| `npm run deploy:prod` | Build and deploy Hosting and Functions |

Backend-specific commands:

```bash
npm --prefix backend/server run dev
npm --prefix backend/server start
npm --prefix backend/server run migrate:firestore
```

## API overview

The Express server mounts routes under `/api` for products, admin product operations, authentication, reviews, users, orders, images, and AI assistance. The exact route modules live in `backend/server/src/routes/`; Swagger reference data is in `backend/server/src/docs/swagger.json`.

Health checks:

- `GET /health`
- `GET /api/health`

## Firebase deployment

1. Install and authenticate the Firebase CLI.
2. Select or update the project alias in `.firebaserc`.
3. Review every rule under `database/` before deploying.
4. Configure server secrets through Firebase/Google Cloud rather than committing them.
5. Run:

```bash
npm run build:all
firebase deploy --only hosting,functions
```

The root `firebase.json` serves `dist/`, rewrites `/api/**` to the `api` Cloud Function, and uses `backend/functions` as the Functions source directory.

## Product data and media

- `data/products.json` is the primary imported catalogue dataset and currently contains 123 records.
- `public/products.json` is the browser fallback catalogue.
- `public/images/` contains the canonical product-image library.
- Product migration and image-maintenance utilities are under `scripts/` and `backend/server/scripts/`.

The media library makes the initial clone relatively large. Product images are stored with Git LFS; run `git lfs install` once on a new machine and `git lfs pull` after cloning. Generated `dist/` images and duplicate backup copies are not committed.

## Security checklist

- Keep `.env`, service-account keys, API secrets, and payment secrets out of Git.
- Rotate any credential that has previously been shared or committed elsewhere.
- Review Firebase and database rules before production deployment.
- Use a long random `JWT_SECRET` and strong administrative credentials.
- Configure CORS, authentication claims, payment webhooks, and rate limiting for the production domains.
- Treat Firebase client configuration as public identifiers; protect data through Auth, App Check, and security rules.

## Verification

Before opening a pull request or deploying:

```bash
npm ci
npm run build
npm --prefix Fox-Orthotics-Admin ci
npm run build:admin
npm --prefix backend/server ci
```

The backend package currently defines no automated test suite, so API changes should also be checked manually against the health endpoint and relevant routes.

## License

The package metadata declares the project under the ISC license. Add a root `LICENSE` file before distributing the project if a formal license text is required.

## Maintainer

Aarushi Gupta — [@aarushi787](https://github.com/aarushi787)
