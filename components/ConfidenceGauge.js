"use client";

export default function ConfidenceGauge({ value, label, color }) {
  // value: 0..1 or null while warming up
  const pct = value === null ? 0 : Math.round(value * 100);
  const r = 54;
  const c = 2 * Math.PI * r;
  const filled = value === null ? 0 : value * c;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c - filled}`}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }}
        />
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fontSize="26"
          fontFamily="var(--mono)"
          fill="var(--text)"
        >
          {value === null ? "—" : `${pct}%`}
        </text>
        <text x="70" y="86" textAnchor="middle" fontSize="10" fill="var(--text-faint)" fontFamily="var(--sans)">
          confidence
        </text>
      </svg>
      <div style={{ fontFamily: "var(--mono)", fontSize: 13, color, letterSpacing: 0.3 }}>{label}</div>
    </div>
  );
}
