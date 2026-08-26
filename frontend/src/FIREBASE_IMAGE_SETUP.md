# Firebase image setup

The storefront reads Firebase web-client configuration from the root `.env` file. Copy `.env.example` to `.env` and populate the `VITE_FIREBASE_*` values from Firebase Console → Project settings → Your apps.

Product images may be served from `public/images/` or Firebase Storage. Keep Firebase Storage rules in `database/storage.rules` and review them before deployment.

Do not commit `.env` files or Firebase Admin service-account JSON files. Firebase web configuration is delivered to browsers by design, so production access must be protected with Firebase Authentication, App Check, and restrictive Firestore/Storage rules.
