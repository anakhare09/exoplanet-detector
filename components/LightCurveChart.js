"use client";
import { useMemo, useState } from "react";

const W = 900;
const H = 300;
const PAD_L = 46;
const PAD_R = 16;
const PAD_T = 20;
const PAD_B = 30;

function downsample(arr, targetLen) {
  if (arr.length <= targetLen) return arr.map((v, i) => ({ v, i }));
  const bucket = arr.length / targetLen;
  const out = [];
  for (let t = 0; t < targetLen; t++) {
    const start = Math.floor(t * bucket);
    const end = Math.floor((t + 1) * bucket);
    let min = Infinity,
      max = -Infinity,
      minI = start,
      maxI = start;
    for (let k = start; k < end && k < arr.length; k++) {
      if (arr[k] < min) {
        min = arr[k];
        minI = k;
      }
      if (arr[k] > max) {
        max = arr[k];
        maxI = k;
      }
    }
    if (minI <= maxI) {
      out.push({ v: min, i: minI });
      out.push({ v: max, i: maxI });
    } else {
      out.push({ v: max, i: maxI });
      out.push({ v: min, i: minI });
    }
  }
  return out;
}

export default function LightCurveChart({ raw, accentColor }) {
  const [hover, setHover] = useState(null);

  const points = useMemo(() => downsample(raw, 420), [raw]);

  const { path, scaleX, scaleY, lo, hi, dipIndex } = useMemo(() => {
    const lo = Math.min(...points.map((p) => p.v));
    const hi = Math.max(...points.map((p) => p.v));
    const range = hi - lo || 1;
    const n = raw.length;
    const scaleX = (i) => PAD_L + (i / (n - 1)) * (W - PAD_L - PAD_R);
    const scaleY = (v) => PAD_T + (1 - (v - lo) / range) * (H - PAD_T - PAD_B);
    let d = "";
    points.forEach((p, idx) => {
      d += `${idx === 0 ? "M" : "L"} ${scaleX(p.i).toFixed(1)} ${scaleY(p.v).toFixed(1)} `;
    });
    let dipIndex = 0;
    let dipVal = Infinity;
    raw.forEach((v, i) => {
      if (v < dipVal) {
        dipVal = v;
        dipIndex = i;
      }
    });
    return { path: d, scaleX, scaleY, lo, hi, dipIndex };
  }, [points, raw]);

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const frac = Math.max(0, Math.min(1, (x - PAD_L) / (W - PAD_L - PAD_R)));
    const idx = Math.round(frac * (raw.length - 1));
    setHover(idx);
  }

  const color = accentColor || "var(--accent)";

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        style={{ display: "block", overflow: "visible", cursor: "crosshair" }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + f * (H - PAD_T - PAD_B)}
            y2={PAD_T + f * (H - PAD_T - PAD_B)}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}
        <text x={4} y={scaleY(hi) + 4} fontSize="11" fill="var(--text-faint)" fontFamily="var(--mono)">
          {hi.toFixed(0)}
        </text>
        <text x={4} y={scaleY(lo) + 4} fontSize="11" fill="var(--text-faint)" fontFamily="var(--mono)">
          {lo.toFixed(0)}
        </text>

        <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" opacity="0.9" />

        <circle
          cx={scaleX(dipIndex)}
          cy={scaleY(raw[dipIndex])}
          r="3.5"
          fill={color}
          opacity="0.9"
        />

        {hover !== null && (
          <>
            <line
              x1={scaleX(hover)}
              x2={scaleX(hover)}
              y1={PAD_T}
              y2={H - PAD_B}
              stroke="var(--line-strong)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx={scaleX(hover)} cy={scaleY(raw[hover])} r="3" fill="var(--text)" />
          </>
        )}

        <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="var(--line-strong)" strokeWidth="1" />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--mono)",
          fontSize: 11,
          color: "var(--text-faint)",
          marginTop: 4,
        }}
      >
        <span>t = 0</span>
        <span>
          {hover !== null
            ? `point ${hover} · flux ${raw[hover].toFixed(1)}`
            : `${raw.length} measurements · lowest point marked`}
        </span>
        <span>t = {raw.length - 1}</span>
      </div>
    </div>
  );
}
