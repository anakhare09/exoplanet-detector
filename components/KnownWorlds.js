"use client";
import { useState } from "react";

function Field({ label, value, unit }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 15, color: "var(--text)" }}>
        {value}
        {unit ? <span style={{ color: "var(--text-faint)", fontSize: 12 }}> {unit}</span> : null}
      </div>
    </div>
  );
}

export default function KnownWorlds() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  async function search(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`/api/planet?name=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setResults(data.results || []);
      setStatus("done");
    } catch (err) {
      setError("Couldn't reach the archive. Check the connection and try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      <form onSubmit={search} style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Kepler-22 b, TRAPPIST-1 e, 51 Pegasi b"
          style={{
            flex: "1 1 260px",
            padding: "12px 14px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--line-strong)",
            background: "var(--bg-elevated)",
            color: "var(--text)",
            fontSize: 14,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "var(--radius)",
            border: "1px solid var(--accent)",
            background: "var(--accent-soft)",
            color: "var(--accent)",
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "var(--mono)",
          }}
        >
          {status === "loading" ? "Searching…" : "Look up"}
        </button>
      </form>

      {status === "error" && (
        <div style={{ color: "var(--accent)", fontSize: 14, marginBottom: 16 }}>{error}</div>
      )}

      {status === "done" && results.length === 0 && (
        <div style={{ color: "var(--text-faint)", fontSize: 14 }}>
          No confirmed planet matched that name. Try a shorter fragment, like "Kepler-22".
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {results.map((p, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              background: "var(--bg-elevated)",
              padding: "18px 20px",
            }}
          >
            <div style={{ fontFamily: "var(--serif)", fontSize: 19, marginBottom: 2 }}>{p.pl_name}</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 14 }}>
              orbiting {p.hostname}
              {p.disc_year ? ` · discovered ${p.disc_year}` : ""}
              {p.discoverymethod ? ` via ${p.discoverymethod.toLowerCase()}` : ""}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 14,
              }}
            >
              <Field label="Orbital period" value={p.pl_orbper ? Number(p.pl_orbper).toFixed(2) : null} unit="days" />
              <Field label="Radius" value={p.pl_rade ? Number(p.pl_rade).toFixed(2) : null} unit="Earth radii" />
              <Field label="Mass" value={p.pl_bmasse ? Number(p.pl_bmasse).toFixed(2) : null} unit="Earth masses" />
              <Field label="Equilibrium temp" value={p.pl_eqt ? Math.round(p.pl_eqt) : null} unit="K" />
              <Field label="Host star temp" value={p.st_teff ? Math.round(p.st_teff) : null} unit="K" />
              <Field label="Distance" value={p.sy_dist ? Number(p.sy_dist).toFixed(1) : null} unit="pc" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
