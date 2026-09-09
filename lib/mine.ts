const KEY = "registry-mine";

/** Per-device convenience only, never authoritative. Maps gift id -> the
 * PIN this browser used to claim it, so we can pre-fill the unclaim
 * form and show a "your claim" hint. The real check always happens
 * against the gift's stored hash. */
export function mineMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function rememberMine(id: string, pin: string) {
  try {
    const m = mineMap();
    m[id] = pin;
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    // best effort only
  }
}

export function forgetMine(id: string) {
  try {
    const m = mineMap();
    delete m[id];
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    // best effort only
  }
}
