# Wedding Gift Registry

A gift registry for Reshwin & Anupama's wedding. Guests browse gifts and
claim one with a single click, no account or personal details needed.
A claim is reserved for whoever made it (proven by a PIN they set at
claim time) and stays anonymous to everyone else, including the
couple.

Stack: Next.js (App Router) + Firebase Firestore (realtime) + Tailwind
CSS, deployed on Vercel.

## How it works

- `gifts` is the only Firestore collection. Each document is one gift:
  name, description, category, price, and claim state (`blocked`,
  `blockedAt`, `salt`, `pinHash`).
- Claiming hashes a salt + the PIN the guest chose (client-side, Web
  Crypto SHA-256) and writes it to the doc inside a Firestore
  transaction, so two people claiming the same gift at once can't both
  win.
- Unclaiming re-hashes the entered PIN with the stored salt and
  compares it to `pinHash`. No PINs are ever stored in plain text.
- `firestore.rules` restricts writes so a visitor can only toggle the
  claim fields on an existing gift, or add a brand-new unclaimed gift
  (that's what the seed script uses) — never rename, re-price, delete,
  or pre-claim a gift.
- This is a light deterrent, not bank-grade security: someone could
  brute-force a weak PIN against the (hashed) data directly. Fine for
  a registry among invited guests; worth knowing.

## First-time setup

### 1. Install dependencies

```
npm install
```

### 2. Create a Firebase project

1. Go to <https://console.firebase.google.com>, create a project (or
   reuse one).
2. Build → Firestore Database → Create database → start in
   **production mode** → pick a region close to India.
3. Project settings (gear icon) → General → "Your apps" → add a **Web**
   app. Copy the `firebaseConfig` object it gives you.

### 3. Add the config

Paste that config into two places (they need to match):

- `lib/firebase.ts` — replace the `firebaseConfig` object.
- `scripts/seed.mjs` — replace the `firebaseConfig` object.

This config is not a secret (it identifies the project, it doesn't
authorize access — the security rules do that), so it's fine to commit
it.

### 4. Deploy the security rules

```
npx firebase-tools login
npx firebase-tools use --add        # pick your project
npx firebase-tools deploy --only firestore:rules
```

### 5. Seed the gift list

```
npm run seed
```

Edit `lib/seed-data.ts` any time you want to change the gift list, then
re-run `npm run seed` — it only touches gifts that aren't already
claimed, so live claims are never overwritten.

### 6. Run it locally

```
npm run dev
```

Open <http://localhost:3000>.

## Deploying

Push this repo to GitHub, then either:

- Import it at <https://vercel.com/new>, or
- Run `npx vercel` from this folder and follow the prompts.

No environment variables are needed — the Firebase web config is
already in the source.

## Changing the gift list later

Edit `lib/seed-data.ts` and run `npm run seed` again. Gifts already
claimed are left untouched.
