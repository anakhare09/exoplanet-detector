"use client";
import { useMemo, useState } from "react";

export default function StarCatalog({ catalog, selectedId, onSelect }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "confirmed") return catalog.filter((s) => s.label === 1);
    if (filter === "quiet") return catalog.filter((s) => s.label === 0);
    return catalog;
  }, [catalog, filter]);

  const tabs = [
    { key: "all", label: "All stars" },
    { key: "confirmed", label: "Confirmed worlds" },
    { key: "quiet", label: "Quiet stars" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${filter === t.key ? "var(--accent)" : "var(--line)"}`,
              background: filter === t.key ? "var(--accent-soft)" : "transparent",
              color: filter === t.key ? "var(--accent)" : "var(--text-dim)",
              fontSize: 12.5,
              cursor: "pointer",
              fontFamily: "var(--mono)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        style={{
          overflowY: "auto",
          maxHeight: 420,
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          background: "var(--bg-elevated)",
        }}
      >
        {filtered.length === 0 && (
          <div style={{ padding: 20, color: "var(--text-faint)", fontSize: 13 }}>No stars in this group.</div>
        )}
        {filtered.map((s) => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: active ? "var(--accent-soft)" : "transparent",
                border: "none",
                borderBottom: "1px solid var(--line)",
                cursor: "pointer",
                textAlign: "left",
                color: active ? "var(--accent)" : "var(--text)",
              }}
            >
              <span style={{ fontFamily: "var(--mono)", fontSize: 13 }}>Sample {s.id}</span>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "var(--mono)",
                  padding: "2px 7px",
                  borderRadius: 999,
                  color: s.label === 1 ? "var(--planet)" : "var(--text-faint)",
                  background: s.label === 1 ? "var(--planet-soft)" : "transparent",
                }}
              >
                {s.label === 1 ? "KOI confirmed" : "no known planet"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
