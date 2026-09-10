// Writes (or re-writes) the real gift list to Firestore.
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
  {
    id: "tineco-vacuum",
    name: "Tineco Floor Wet & Dry Vacuum",
    category: "Electronics",
    price: null,
    desc: "Because someone has to vacuum and mop at the same time, and it's not going to be either of us.",
    link: "https://www.amazon.in/Tineco-Cordless-Patented-Self-Cleaning-Warranty/dp/B0F3GYMWG5/ref=sr_1_4?crid=1KGQEHY5BHORL&dib=eyJ2IjoiMSJ9.zFUFbVfYykSznEj70dPtwzWabID1sIGJAh6NGFXGlPxRnGAWMOp1bCiQsNBbrgwJRhEdFEsOZdh5qdOlbu9I5rIUTxBRGSBBUDVDwtWsRnFMMNvy1j8HezBPNTKNMzPJtDQ_VP1rFAr416X6KBmEdH-9sJGnaPmpH62puvdruBplqBvfQZJQx8EhEiPQfayt91jFQzZ8E98ZRyWWc9NHA9AOVJadbuKOUP_eq6dZP9w.kfjqhcDb-sIHImlUxcbyaHJuNk5ihbR1qvr4v-rZgAk&dib_tag=se&keywords=wet%2Bvacuum&qid=1788964508&sprefix=wet%2Bvaccu%2Caps%2C277&sr=8-4&th=1",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "cumin-no9-pan",
    name: "Cumin Co. Enamel Cast Iron Pan, No. 9",
    category: "Kitchen",
    price: null,
    desc: "A proper everyday pan, the kind you reach for before you've even decided what you're cooking.",
    link: "https://www.cuminco.com/products/no-9-enamel-cast-iron-pan-lite-24cm",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "cumin-dosa-tawa",
    name: "Cumin Co. Cast Iron Dosa Tawa",
    category: "Kitchen",
    price: null,
    desc: "For dosas that actually come off the pan in one piece.",
    link: "https://www.cuminco.com/products/no-11-enamel-cast-iron-dosa-tawa-28cm",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "cumin-appam-pan",
    name: "Cumin Co. Cast Iron Appam Pan",
    category: "Kitchen",
    price: null,
    desc: "Weekend appams, the good kind, with the lacy edges.",
    link: "https://www.cuminco.com/products/no-8-enamel-cast-iron-appam-pan-20cm",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "cumin-mini-cocottes",
    name: "Cumin Co. Mini Cocottes",
    category: "Kitchen",
    price: null,
    desc: "Small pots for small, deliberate meals for two.",
    link: "https://www.cuminco.com/products/mini-cocottes-1",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "countertop-dishwasher",
    name: "Countertop Dishwasher",
    category: "Electronics",
    price: null,
    desc: "The single most requested appliance in the history of our relationship.",
    link: "https://www.amazon.in/Countertop-Dishwasher-MDWTT0802D-anti-bacterial-Intensive/dp/B0DSC7JW1V/ref=sr_1_2?crid=35Q0TEO4TLJJU&dib=eyJ2IjoiMSJ9.NA_8-KWLtt9_5oy4hy6-KsTxEKaBMSzdOq8_Ke27AHTi6yutXXDxWsS3hLVKuPxnMHGYQZ1QG4CyB1Y6Q6gIpyAVRY1SnBNYYI1YABStM4tcxmlGArjsIBtYFfguRsj3IhWsiyxVs54hR_5YKSmBRP4Tpcs-tYdNVZflEyAS5_SwhjvEbcTZ-zPtgcSEbpma3cCUMmDHAxQ2-RGsr6Z9CuFwAa5_JNE2wKsrHIKi2iY.MhaDHep7leKKlhdoxr4TNwxnHRyBT8j0FhFBYaVKsS0&dib_tag=se&keywords=table+top+dishwasher&qid=1788968801&sprefix=table+top+dishwash%2Caps%2C325&sr=8-2",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "lego-wildflower-bouquet",
    name: "LEGO Botanicals Wildflower Bouquet",
    category: "Toys & Games",
    price: null,
    desc: "Flowers that never need water and never die, a rare win for both of us.",
    link: "https://www.amazon.in/LEGO-Wildflower-Bouquet-10313-Building/dp/B00BLHX6J8/ref=sr_1_18?crid=18V5B9F3TXY9L&dib=eyJ2IjoiMSJ9.9f0WpRKdSCS8JHUMmTMe3eBQLR2Iin3Z0Qb3L7dcLFymDSBeo3VB5qa_p0g9gKMpC40L0-7DE5hczCUBeMCaGTh5v9sFYzDfsP_HEjgHcAqEDti8ACGuha2Y-IUTkC5jbMUM_lv60wu_q7o8y-QJIWCNKtsYb2J10zPnPqdqMUFhWdyowGQbSw0BYN-39n0dbNPqj95SLaDMjMs7LWsUucmxukY6fAmqOz4GEW6MWIrD9c0AIf3mFxN7EcJ7ixTcZEzqpPWrtoqxfM9YF6_gWMwlooJ_IjPmTsqRaOsI8c0.BnkOZVcBMuFfiUoOuvJVFDBHqt6J_-xdURSfU3agC-g&dib_tag=se&keywords=lego+botanicals&nsdOptOutParam=true&qid=1788968881&sprefix=lego+botanic%2Caps%2C361&sr=8-18",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "lego-mini-plants",
    name: "LEGO Botanicals Mini Plants",
    category: "Toys & Games",
    price: null,
    desc: "Tiny desk plants we are guaranteed not to kill.",
    link: "https://www.amazon.in/LEGO-Botanicals-Plants-10349-Building/dp/B0DWDRZDZC/ref=sr_1_24?crid=18V5B9F3TXY9L&dib=eyJ2IjoiMSJ9.9f0WpRKdSCS8JHUMmTMe3eBQLR2Iin3Z0Qb3L7dcLFymDSBeo3VB5qa_p0g9gKMpC40L0-7DE5hczCUBeMCaGTh5v9sFYzDfsP_HEjgHcAqEDti8ACGuha2Y-IUTkC5jbMUM_lv60wu_q7o8y-QJIWCNKtsYb2J10zPnPqdqMUFhWdyowGQbSw0BYN-39n0dbNPqj95SLaDMjMs7LWsUucmxukY6fAmqOz4GEW6MWIrD9c0AIf3mFxN7EcJ7ixTcZEzqpPWrtoqxfM9YF6_gWMwlooJ_IjPmTsqRaOsI8c0.BnkOZVcBMuFfiUoOuvJVFDBHqt6J_-xdURSfU3agC-g&dib_tag=se&keywords=lego+botanicals&nsdOptOutParam=true&qid=1788968881&sprefix=lego+botanic%2Caps%2C361&sr=8-24",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "lego-tulip-bouquet",
    name: "LEGO Botanicals Tulip Bouquet",
    category: "Toys & Games",
    price: null,
    desc: "More flowers that never wilt. We're building a whole collection.",
    link: "https://www.amazon.in/LEGO-Botanicals-Tulip-Bouquet-Building/dp/B0G3HLKNK8/ref=sr_1_32?crid=18V5B9F3TXY9L&dib=eyJ2IjoiMSJ9.9f0WpRKdSCS8JHUMmTMe3eBQLR2Iin3Z0Qb3L7dcLFymDSBeo3VB5qa_p0g9gKMpC40L0-7DE5hczCUBeMCaGTh5v9sFYzDfsP_HEjgHcAqEDti8ACGuha2Y-IUTkC5jbMUM_lv60wu_q7o8y-QJIWCNKtsYb2J10zPnPqdqMUFhWdyowGQbSw0BYN-39n0dbNPqj95SLaDMjMs7LWsUucmxukY6fAmqOz4GEW6MWIrD9c0AIf3mFxN7EcJ7ixTcZEzqpPWrtoqxfM9YF6_gWMwlooJ_IjPmTsqRaOsI8c0.BnkOZVcBMuFfiUoOuvJVFDBHqt6J_-xdURSfU3agC-g&dib_tag=se&keywords=lego+botanicals&nsdOptOutParam=true&qid=1788968881&sprefix=lego+botanic%2Caps%2C361&sr=8-32",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "lego-typewriter",
    name: "LEGO Creator Typewriter",
    category: "Toys & Games",
    price: null,
    desc: "A build for a rainy evening, and a nice shelf piece after.",
    link: "https://www.amazon.in/LEGO-Creator-Typewriter-31169-Building/dp/B0DHSDQVDR/ref=sr_1_39?crid=18V5B9F3TXY9L&dib=eyJ2IjoiMSJ9.9f0WpRKdSCS8JHUMmTMe3eBQLR2Iin3Z0Qb3L7dcLFymDSBeo3VB5qa_p0g9gKMpC40L0-7DE5hczCUBeMCaGTh5v9sFYzDfsP_HEjgHcAqEDti8ACGuha2Y-IUTkC5jbMUM_lv60wu_q7o8y-QJIWCNKtsYb2J10zPnPqdqMUFhWdyowGQbSw0BYN-39n0dbNPqj95SLaDMjMs7LWsUucmxukY6fAmqOz4GEW6MWIrD9c0AIf3mFxN7EcJ7ixTcZEzqpPWrtoqxfM9YF6_gWMwlooJ_IjPmTsqRaOsI8c0.BnkOZVcBMuFfiUoOuvJVFDBHqt6J_-xdURSfU3agC-g&dib_tag=se&keywords=lego+botanicals&nsdOptOutParam=true&qid=1788968881&sprefix=lego+botanic%2Caps%2C361&sr=8-39",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "catan",
    name: "Catan",
    category: "Toys & Games",
    price: null,
    desc: "For game nights that start friendly and don't stay that way.",
    link: "https://www.amazon.in/Mayfair-Games-Catan-Pack-Multicolor/dp/B00U26V4VQ/ref=sr_1_1?crid=2P5P7TMKO0ONN&dib=eyJ2IjoiMSJ9.RaY9AVNYTCALI_MhlTo-8TSizox40_1ewVCFrXGJwaH12LY_LIeNIzoClW_ZioX3Ft6GPXtOOnU34i6Urc2xJsuopjhb-8VtiY2gtJsiU_iQaL7BQhL80WvJzAIykAjR9mE4Hcq095YOJ86v81aShScFYqqyr3ZsQzjn11OsbYH8UdBJvIO6A-JhVlESRbczdC1Kvz8lF3aZUhuJK57Dx-zBlXovw_zoA7XDuaM7jvU2woU_j7r53vIJg0sYECibXvpHIHRhdmhDc5UJJsznhtaPxGFDVP6gnBXKbgfEvSI.bTyX9mvR4LLP-uWkfQjJOYJwxnkwMojmzyPyGC-XH6g&dib_tag=se&keywords=catan&nsdOptOutParam=true&qid=1788969782&sprefix=cata%2Caps%2C301&sr=8-1&th=1",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "pokemon-prismatic-evolutions",
    name: "Pokémon Prismatic Evolutions Mini Tin",
    category: "Toys & Games",
    price: null,
    desc: "A small, very serious hobby that needs no further explanation.",
    link: "https://tcgrepublic.in/shop/collection-box-set/pokemon-prismatic-evolution-mini-tin-random/",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "bamboo-bedsheets",
    name: "Bamboo King Size Bedsheet Set",
    category: "Home & Living",
    price: null,
    desc: "Soft sheets for the bed we'll actually be sharing from now on.",
    link: "https://www.amazon.in/dp/B0F4Z2ZCKZ?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_1&th=1",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "table-lamp",
    name: "Table Lamp",
    category: "Home & Living",
    price: null,
    desc: "Warm light for a room that's finally ours.",
    link: "https://www.myntra.com/table-lamps/the+better+home/the-better-home-green-flower-table-lamps/41402832/buy",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "ceramic-tea-cup",
    name: "Ceramic Tea Cup & Plate Set",
    category: "Dining",
    price: null,
    desc: "For slow mornings and the tea we both take too seriously.",
    link: "https://www.calling.website/products/calling-ceramic-paper-cup-plate?srsltid=AfmBOoryI9-1YHLA-h-vHNDZ9ujwAtyjHt_JeZXimL2LyuDgXBMMmaML",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "tulip-wine-glasses",
    name: "Tulip Wine Glasses, Set of 2",
    category: "Dining",
    price: null,
    desc: "For anniversaries, and also just Tuesdays.",
    link: "https://nestasia.in/products/luxe-tulip-wine-glass-set-of-2-320ml?currency=INR&country=IN&variant=44271063564397&stkn=28e37e0435b9&gclsrc=aw.ds&&utm_campaign=Std_Shopping_Brand-CatKW_AllProducts_23rdSept24&utm_source=google&utm_medium=cpc&utm_matchtype=&utm_term=&adgroupid=164706360615&gc_id=21452835574&h_ad_id=705191269613&gad_source=1&gad_campaignid=21452835574&gbraid=0AAAAAC_nNhSkJenAE_UsvwMS3xkiHn_CW&gclid=Cj0KCQjwh4TVBhCWARIsAG0czmqVbaclGlCKxSSDrytYqt7hEAo4Lp9AHvNm0t3El5JilEojcI3DncMaAoL3EALw_wcB",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "dinner-set-14pc",
    name: "14-Piece Dinner Set",
    category: "Dining",
    price: null,
    desc: "Matching plates, finally, instead of whatever survived our old flats.",
    link: "https://nestasia.in/products/sera-pink-14-piece-minimalistic-dinner-set-for-6?_gl=1*1umbul6*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwh4TVBhCWARIsAG0czmoaMTgNANKhFSZ2h-0YW2UcD2uyRvn0rmompHuw4N2qwVxpcLhAIOMaAnH4EALw_wcB&gclsrc=aw.ds&gbraid=0AAAAAC_nNhSkJenAE_UsvwMS3xkiHn_CW",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "kaanch-collection",
    name: "Anything from Kaanch",
    category: "Home & Living",
    price: null,
    desc: "We love everything they make. Pick whatever catches your eye.",
    link: "https://kaanch.co.in/",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "matcha-set",
    name: "Matcha Ceremony Set",
    category: "Dining",
    price: null,
    desc: "For the matcha phase that shows no signs of ending.",
    link: "https://saabihouse.in/products/blush-flower-matcha-set-ceramic-bowl-whisk-holder?_pos=3&_sid=e8845beb6&_ss=r",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "saabi-house-mugs",
    name: "Anything from Saabi House Mugs & Cups",
    category: "Dining",
    price: null,
    desc: "Any mug from their shop. We're building a whole shelf of these.",
    link: "https://saabihouse.in/collections/cups-and-mugs",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
  {
    id: "klaylist-collection",
    name: "Anything from Klaylist",
    category: "Keepsakes",
    price: null,
    desc: "Handmade pieces we'd love to have around the house. Your pick.",
    link: "https://klaylist.com/?srsltid=AfmBOoqxuoO0p5uyJ9YoB0PPiPEI3Zp7rraE6xRIEioYtGb60Iry65e0",
    blocked: false,
    blockedAt: null,
    salt: null,
    pinHash: null,
  },
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
