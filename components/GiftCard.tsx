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
  const meta = (
    <div className="meta">
      {gift.price != null && <span className="price">{formatPrice(gift.price)}</span>}
      <span className="cat-label">{gift.category}</span>
    </div>
  );

  const viewLink = gift.link && (
    <a className="view-link" href={gift.link} target="_blank" rel="noopener noreferrer">
      View item &#8599;
    </a>
  );

  // Gift cards, unlike everything else on the registry, aren't a single
  // physical item: any number of people can send one, so there's no
  // claim/PIN flow here, just a styled button that opens the link.
  if (gift.category === "Travel") {
    return (
      <article className="card">
        <div className="icon-badge">{CATEGORY_ICONS[gift.category]}</div>
        <h3>{gift.name}</h3>
        <p className="desc">{gift.desc}</p>
        {meta}
        <a className="btn btn-claim" href={gift.link ?? undefined} target="_blank" rel="noopener noreferrer">
          Get the link &#8599;
        </a>
      </article>
    );
  }

  if (!gift.blocked) {
    return (
      <article className="card">
        <div className="icon-badge">{CATEGORY_ICONS[gift.category]}</div>
        <h3>{gift.name}</h3>
        <p className="desc">{gift.desc}</p>
        {meta}
        {viewLink}
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
      {meta}
      {viewLink}
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
