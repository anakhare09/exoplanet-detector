"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        background: "transparent",
        border: "1px solid var(--line-strong)",
        borderRadius: "999px",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--text)",
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      {theme === "dark" ? "☾" : "☼"}
    </button>
  );
}
