// Writes (or re-writes) the placeholder gift list to Firestore.
// Run with: npm run seed
//
// Safe to re-run: it uses setDoc with merge:false only for gifts that
// don't already exist as *claimed* — a gift that's already been
// claimed is left untouched so you never accidentally wipe someone's
// claim by re-seeding.
//
// Uses the regular Firestore client SDK (no service account needed) —
// firestore.rules allows creating a fresh, unclaimed gift document, so
// this works the same way a browser would.

import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

// Keep this in sync with lib/firebase.ts.
const firebaseConfig = {
  apiKey: "AIzaSyBy_hCpWlbpoTX2BDkbZQ5ZM6WGziVtplc",
  authDomain: "wedding-registry-31c5c.firebaseapp.com",
  projectId: "wedding-registry-31c5c",
  storageBucket: "wedding-registry-31c5c.firebasestorage.app",
  messagingSenderId: "398366975460",
  appId: "1:398366975460:web:89621603e3c877856393f1",
};

// Keep this in sync with lib/seed-data.ts.
const SEED_GIFTS = [
  { id: "stand-mixer", name: "Stand Mixer", category: "Kitchen", price: 22000, desc: "For the sourdough phase we both keep threatening to start." },
  { id: "espresso-machine", name: "Espresso Machine", category: "Kitchen", price: 32000, desc: "So our mornings run on something other than instant coffee." },
  { id: "cast-iron-set", name: "Cast Iron Cookware Set", category: "Kitchen", price: 9500, desc: "Three pans that will outlive us both." },
  { id: "bedsheet-set", name: "Egyptian Cotton Bedsheet Set", category: "Home & Living", price: 6800, desc: "Crisp, cool, and worth the splurge neither of us would make alone." },
  { id: "bar-cart", name: "Brass Bar Cart", category: "Home & Living", price: 21000, desc: "For hosting the people who couldn't make it to the wedding." },
  { id: "dinnerware-set", name: "12-Piece Dinnerware Set", category: "Dining", price: 13500, desc: "Matching plates, finally, instead of whatever survived our old flats." },
  { id: "wine-glasses", name: "Crystal Wine Glasses, Set of 6", category: "Dining", price: 7200, desc: "For anniversaries, and also just Tuesdays." },
  { id: "smart-speaker", name: "Smart Home Speaker", category: "Electronics", price: 8500, desc: "To settle arguments about facts and play music while we cook." },
  { id: "robot-vacuum", name: "Robot Vacuum", category: "Electronics", price: 24000, desc: "A third roommate, one who actually does the cleaning." },
  { id: "getaway-voucher", name: "Weekend Getaway Voucher", category: "Experiences", price: 16000, desc: "A trip we'll actually book instead of just talking about." },
  { id: "cooking-class", name: "Couples Cooking Class", category: "Experiences", price: 6000, desc: "Two people who cannot follow a recipe, supervised." },
  { id: "photo-frame-set", name: "Custom Photo Frame Set", category: "Keepsakes", price: 4500, desc: "Somewhere to put the wedding photos besides our phones." },
];

if (firebaseConfig.apiKey === "REPLACE_ME") {
  console.error(
    "Fill in firebaseConfig in scripts/seed.mjs (and lib/firebase.ts) with your Firebase project's web config first.",
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const gift of SEED_GIFTS) {
  const { id, ...fields } = gift;
  const ref = doc(db, "gifts", id);
  const existing = await getDoc(ref);
  if (existing.exists() && existing.data().blocked) {
    console.log(`skip  ${id} (already claimed, left alone)`);
    continue;
  }
  await setDoc(ref, {
    ...fields,
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  });
  console.log(`wrote ${id}`);
}

console.log("Done.");
process.exit(0);
