"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
} from "firebase/firestore";
import { db, GIFTS_COLLECTION } from "@/lib/firebase";
import type { Gift } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { randomHex, sha256Hex } from "@/lib/crypto";
import { mineMap, rememberMine, forgetMine } from "@/lib/mine";
import { GiftCard } from "./GiftCard";
import { ClaimModal } from "./ClaimModal";
import { UnclaimModal } from "./UnclaimModal";

const COUPLE_NAMES = "Reshwin & Anupama";

type ModalState = { type: "claim" | "unclaim"; giftId: string } | null;

export function RegistryApp() {
  const [gifts, setGifts] = useState<Gift[] | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [modal, setModal] = useState<ModalState>(null);
  const [toast, setToast] = useState("");
  const [mine, setMine] = useState<Record<string, string>>({});

  useEffect(() => {
    setMine(mineMap());
    const q = query(collection(db, GIFTS_COLLECTION), orderBy("name"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setGifts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Gift, "id">) })));
      },
      () => {
        setToast("Couldn't load the registry. Check your connection and reload.");
      },
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const categories = useMemo(() => {
    if (!gifts) return [];
    return CATEGORIES.filter((c) => gifts.some((g) => g.category === c));
  }, [gifts]);

  const visible = useMemo(() => {
    if (!gifts) return [];
    return filter === "All" ? gifts : gifts.filter((g) => g.category === filter);
  }, [gifts, filter]);

  const available = gifts?.filter((g) => !g.blocked).length ?? 0;
  const modalGift = modal ? gifts?.find((g) => g.id === modal.giftId) ?? null : null;

  async function claim(giftId: string, pin: string): Promise<string | null> {
    const salt = randomHex(16);
    const pinHash = await sha256Hex(salt + pin);
    try {
      await runTransaction(db, async (tx) => {
        const ref = doc(db, GIFTS_COLLECTION, giftId);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("missing");
        if (snap.data().blocked) throw new Error("already-claimed");
        tx.update(ref, { blocked: true, blockedAt: new Date().toISOString(), salt, pinHash });
      });
    } catch (e) {
      if (e instanceof Error && e.message === "already-claimed") {
        setModal(null);
        setToast("Someone else just claimed this a moment before you.");
        return null;
      }
      return "Couldn't save that just now, please try again.";
    }
    rememberMine(giftId, pin);
    setMine(mineMap());
    setModal(null);
    return null;
  }

  async function unclaim(giftId: string, pin: string): Promise<string | null> {
    try {
      let mismatch = false;
      await runTransaction(db, async (tx) => {
        const ref = doc(db, GIFTS_COLLECTION, giftId);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("missing");
        const data = snap.data();
        if (!data.blocked) return; // already unclaimed elsewhere; nothing to do
        const hash = await sha256Hex((data.salt || "") + pin);
        if (hash !== data.pinHash) {
          mismatch = true;
          return;
        }
        tx.update(ref, { blocked: false, blockedAt: null, salt: null, pinHash: null });
      });
      if (mismatch) return "That PIN doesn't match, try again.";
    } catch {
      return "Couldn't save that just now, please try again.";
    }
    forgetMine(giftId);
    setMine(mineMap());
    setModal(null);
    return null;
  }

  return (
    <div className="wrap">
      <header className="hero">
        <span className="eyebrow">{COUPLE_NAMES}</span>
        <h1 className="names">Our Gift Registry</h1>
        <p className="lede">
          We&rsquo;ve picked out a few things that would help us most as we start our life
          together in Chennai. If something catches your eye, claim it and it&rsquo;s yours to
          give. You don&rsquo;t need to tell us who you are: once a gift is claimed, it&rsquo;s
          reserved for that person alone, and everyone else will simply see it&rsquo;s taken.
        </p>
        <div className="divider" aria-hidden="true" />
        {gifts && (
          <p className="status-line">
            {available} of {gifts.length} gifts still available
          </p>
        )}
      </header>

      {!gifts ? (
        <p className="loading">Loading the registry…</p>
      ) : (
        <>
          <div className="filters">
            <button
              className={"chip" + (filter === "All" ? " active" : "")}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                className={"chip" + (filter === c ? " active" : "")}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid">
            {visible.map((g) => (
              <GiftCard
                key={g.id}
                gift={g}
                mine={mine[g.id] !== undefined}
                onClaim={() => setModal({ type: "claim", giftId: g.id })}
                onUnclaim={() => setModal({ type: "unclaim", giftId: g.id })}
              />
            ))}
          </div>
        </>
      )}

      <footer className="foot">Thank you, truly, for being part of our day.</footer>

      {modal && modalGift && modal.type === "claim" && (
        <ClaimModal gift={modalGift} onCancel={() => setModal(null)} onConfirm={(pin) => claim(modalGift.id, pin)} />
      )}
      {modal && modalGift && modal.type === "unclaim" && (
        <UnclaimModal
          gift={modalGift}
          savedPin={mine[modalGift.id] ?? null}
          onCancel={() => setModal(null)}
          onConfirm={(pin) => unclaim(modalGift.id, pin)}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
