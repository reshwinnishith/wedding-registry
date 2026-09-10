"use client";

import { useEffect, useRef, useState } from "react";
import type { Gift } from "@/lib/types";

export function UnclaimModal({
  gift,
  savedPin,
  onCancel,
  onConfirm,
}: {
  gift: Gift;
  savedPin: string | null;
  onCancel: () => void;
  onConfirm: (pin: string) => Promise<string | null>;
}) {
  const [pin, setPin] = useState(savedPin ?? "");
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
    if (!pin) {
      setError("Enter the PIN you set when you claimed this.");
      return;
    }
    setBusy(true);
    setError("");
    const err = await onConfirm(pin);
    if (err) {
      setBusy(false);
      setError(err);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Unclaim &ldquo;{gift.name}&rdquo;?</h2>
        <p className="modal-desc">
          Enter the PIN you set when you claimed this gift. It&rsquo;ll go back to being available
          to everyone, so you&rsquo;re free to pick something else instead.
        </p>
        <div className="field">
          <label htmlFor="unpin">PIN</label>
          <input
            ref={firstInput}
            id="unpin"
            type="password"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          {savedPin && (
            <p className="field-hint">We remembered this from when you claimed it on this device.</p>
          )}
        </div>
        <p className="field-error">{error}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Checking…" : "Unclaim"}
          </button>
        </div>
      </div>
    </div>
  );
}
