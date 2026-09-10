"use client";

import { useRef, useState } from "react";

const CAPTIONS_LOW = ["keeping an eye on the list", "just supervising"];
const CAPTIONS_MID = ["good pick", "sniffed and approved", "she agrees", "solid choice", "wags of approval"];
const CAPTIONS_ALL = ["that's everything, thank you", "nothing left to sniff out"];

function pickCaption(ratio: number): string {
  const pool = ratio >= 1 ? CAPTIONS_ALL : ratio > 0 ? CAPTIONS_MID : CAPTIONS_LOW;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function DogMascot({ available, total }: { available: number; total: number }) {
  const claimedRatio = total > 0 ? 1 - available / total : 0;
  const pose = claimedRatio >= 1 ? "allclaimed" : claimedRatio >= 0.5 ? "happy" : claimedRatio > 0 ? "content" : "calm";

  const [booping, setBooping] = useState(false);
  const [caption, setCaption] = useState("");
  const boopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function boop() {
    setCaption(pickCaption(claimedRatio));
    setBooping(true);
    if (boopTimer.current) clearTimeout(boopTimer.current);
    boopTimer.current = setTimeout(() => setBooping(false), 1800);
  }

  return (
    <div className="mascot-zone">
      <div
        className={"mascot-wrap" + (booping ? " boop" : "")}
        data-pose={pose}
        role="button"
        tabIndex={0}
        aria-label="Boop the dog"
        onClick={boop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            boop();
          }
        }}
      >
        <div className="mascot-caption">{caption}</div>
        <svg className="mascot-svg" viewBox="0 0 200 190">
          <path className="mascot-ear mascot-ear-l" d="M62,68 C40,74 28,112 38,148 C46,172 68,174 73,153 C78,130 72,88 62,68 Z" />
          <path className="mascot-ear mascot-ear-r" d="M138,68 C160,74 172,112 162,148 C154,172 132,174 127,153 C122,130 128,88 138,68 Z" />
          <ellipse className="mascot-head" cx="100" cy="93" rx="50" ry="44" />
          <ellipse className="mascot-muzzle-shade" cx="100" cy="128" rx="30" ry="26" />
          <path className="mascot-eye-white" d="M68,80 C68,72 78,70 82,76 C86,82 82,92 74,91 C69,90 68,85 68,80 Z" />
          <path className="mascot-eye-white" d="M132,80 C132,72 122,70 118,76 C114,82 118,92 126,91 C131,90 132,85 132,80 Z" />
          <circle className="mascot-pupil" cx="77" cy="82" r="3.4" />
          <circle className="mascot-pupil" cx="123" cy="82" r="3.4" />
          <circle className="mascot-eye-spark" cx="78.5" cy="80" r="1.1" />
          <circle className="mascot-eye-spark" cx="124.5" cy="80" r="1.1" />
          <path className="mascot-tongue mascot-tongue-back" d="M90,148 C90,148 92,178 100,180 C108,178 110,148 110,148 Z" />
          <path className="mascot-tongue mascot-tongue-mid" d="M97,150 L97,172 L103,172 L103,150 Z" />
          <g className="mascot-ring" transform="translate(100,116)">
            <ellipse className="mascot-ring-glow" cx="0" cy="0" rx="19" ry="15" />
            <path className="mascot-ring-band" d="M-15,7 Q-8,15 0,9 Q8,15 15,7" />
            <circle className="mascot-ring-prong" cx="-11" cy="-2" r="2.6" />
            <circle className="mascot-ring-prong" cx="11" cy="-2" r="2.6" />
            <ellipse className="mascot-ring-stone" cx="0" cy="-2" rx="9.5" ry="7.2" transform="rotate(-6)" />
            <ellipse className="mascot-ring-glint" cx="-2.6" cy="-4.6" rx="2.2" ry="1.4" transform="rotate(-20)" />
            <g className="mascot-sparkle">
              <path d="M-24,-12 L-22,-5 L-15,-3 L-22,-1 L-24,6 L-26,-1 L-33,-3 L-26,-5 Z" />
              <path d="M24,-16 L25.6,-11 L30,-9.4 L25.6,-7.8 L24,-3 L22.4,-7.8 L18,-9.4 L22.4,-11 Z" />
            </g>
          </g>
        </svg>
      </div>
      <span className="mascot-hint">psst, boop her</span>
    </div>
  );
}
