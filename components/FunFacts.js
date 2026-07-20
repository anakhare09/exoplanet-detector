"use client";
import { useState } from "react";

const FACTS = [
  "Kepler stared at roughly 150,000 stars in a single patch of sky, near the constellations Cygnus and Lyra, almost without blinking for four years.",
  "A transit this model looks for can be tiny: Earth crossing the Sun dims its light by less than a hundredth of a percent.",
  "Kepler-16b orbits two suns at once — the real-world planet that inspired Star Wars' Tatooine.",
  "Most confirmed exoplanets are closer in size to Neptune than to Earth; true Earth-sized worlds are still rare finds.",
  "Some rogue planets drift through the galaxy with no star to orbit at all.",
  "The closest known exoplanet, Proxima Centauri b, is about 4.2 light-years away — still far too far to visit with any spacecraft we can build today.",
  "Kepler's reaction wheels began failing in 2013, but engineers repurposed the drifting telescope for a second mission, K2, using sunlight pressure for balance.",
  "A 'hot Jupiter' can orbit its star in under a day, baking at temperatures over 1,000°C.",
];

export default function FunFacts() {
  const [i, setI] = useState(0);
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "var(--bg-elevated)",
        padding: "20px 22px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ color: "var(--accent)" }}>✦</span>
        <span style={{ fontFamily: "var(--serif)", fontSize: 16 }}>Did you know?</span>
      </div>
      <p style={{ color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>{FACTS[i]}</p>
      <button
        onClick={() => setI((i + 1) % FACTS.length)}
        style={{
          marginTop: 14,
          background: "none",
          border: "none",
          color: "var(--accent)",
          fontFamily: "var(--mono)",
          fontSize: 12.5,
          cursor: "pointer",
          padding: 0,
        }}
      >
        Another fact ›
      </button>
    </div>
  );
}
