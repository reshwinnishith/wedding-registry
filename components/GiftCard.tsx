"use client";

import type { Gift } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { CATEGORY_ICONS } from "@/lib/categories";

export function GiftCard({
  gift,
  mine,
  onClaim,
  onUnclaim,
}: {
  gift: Gift;
  mine: boolean;
  onClaim: () => void;
  onUnclaim: () => void;
}) {
  if (!gift.blocked) {
    return (
      <article className="card">
        <div className="icon-badge">{CATEGORY_ICONS[gift.category]}</div>
        <h3>{gift.name}</h3>
        <p className="desc">{gift.desc}</p>
        <div className="meta">
          <span className="price">{formatPrice(gift.price)}</span>
          <span className="cat-label">{gift.category}</span>
        </div>
        <button className="btn btn-claim" onClick={onClaim}>
          I&rsquo;ll get this
        </button>
      </article>
    );
  }

  return (
    <article className="card taken">
      <div className="icon-badge">{CATEGORY_ICONS[gift.category]}</div>
      <h3>{gift.name}</h3>
      <p className="desc">{gift.desc}</p>
      <div className="meta">
        <span className="price">{formatPrice(gift.price)}</span>
        <span className="cat-label">{gift.category}</span>
      </div>
      <div className="taken-row">
        <span className="taken-badge">
          <span className="dot" />
          Claimed
        </span>
        <button className="link-unblock" onClick={onUnclaim}>
          {mine ? "Unclaim" : "Unclaim, if this was you"}
        </button>
      </div>
    </article>
  );
}
