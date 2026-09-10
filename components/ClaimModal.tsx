"use client";

import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ClaimModal({
  gift,
  onCancel,
  onConfirm,
}: {
  gift: Gift;
  onCancel: () => void;
  onConfirm: (pin: string) => Promise<string | null>; // resolves an error message, or null on success
}) {
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInput.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  async function submit() {
    if (pin1.trim().length < 4) {
      setError("Choose at least 4 characters.");
      return;
    }
    if (pin1 !== pin2) {
      setError("Those two don't match.");
      return;
    }
    setBusy(true);
    setError("");
    const err = await onConfirm(pin1);
    if (err) {
      setBusy(false);
      setError(err);
    }
    // on success, the parent updates state and unmounts this modal
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Claim &ldquo;{gift.name}&rdquo;?</h2>
        <p className="modal-desc">
          This reserves <b>{gift.name}</b>{gift.price != null ? ` (${formatPrice(gift.price)})` : ""} just
          for you. Other guests will see it as taken, but never who took it.
        </p>
        <div className="field">
          <label htmlFor="pin1">Set a PIN</label>
          <input
            ref={firstInput}
            id="pin1"
            type="password"
            autoComplete="off"
            placeholder="A word or number only you’ll remember"
            value={pin1}
            onChange={(e) => setPin1(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="pin2">Confirm PIN</label>
          <input
            id="pin2"
            type="password"
            autoComplete="off"
            value={pin2}
            onChange={(e) => setPin2(e.target.value)}
          />
          <p className="field-hint">You&rsquo;ll need this only if you ever want to undo the claim.</p>
        </div>
        <p className="field-error">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Claiming…" : "Yes, claim this gift"}
          </button>
        </div>
      </div>
    </div>
  );
}
