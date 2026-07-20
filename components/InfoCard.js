"use client";
import { useState } from "react";

export default function InfoCard({ icon, title, teaser, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        background: "var(--bg-elevated)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text)",
          padding: "18px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 20, color: "var(--accent)" }}>{icon}</span>
        <span style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 18 }}>{title}</div>
          {!open && (
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 2 }}>{teaser}</div>
          )}
        </span>
        <span style={{ color: "var(--text-faint)", fontSize: 14, transform: open ? "rotate(45deg)" : "none", transition: "transform .2s" }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 22px 52px", color: "var(--text-dim)", fontSize: 14.5, lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}
