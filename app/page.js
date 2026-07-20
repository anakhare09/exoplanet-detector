"use client";
import { useEffect, useState, useCallback } from "react";
import ThemeToggle from "../components/ThemeToggle";
import StarCatalog from "../components/StarCatalog";
import LightCurveChart from "../components/LightCurveChart";
import ConfidenceGauge from "../components/ConfidenceGauge";
import InfoCard from "../components/InfoCard";
import KnownWorlds from "../components/KnownWorlds";
import FunFacts from "../components/FunFacts";
import { predictExoplanet } from "../lib/model";

export default function Home() {
  const [warmingUp, setWarmingUp] = useState(true);
  const [catalog, setCatalog] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [starData, setStarData] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loadingStar, setLoadingStar] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWarmingUp(false), 900);
    fetch("/data/catalog.json")
      .then((r) => r.json())
      .then((data) => {
        setCatalog(data);
        const firstPlanet = data.find((s) => s.label === 1);
        if (firstPlanet) selectStar(firstPlanet.id);
      });
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectStar = useCallback((id) => {
    setSelectedId(id);
    setLoadingStar(true);
    setConfidence(null);
    fetch(`/data/stars/${id}.json`)
      .then((r) => r.json())
      .then((data) => {
        setStarData(data);
        // run the real model in the browser
        setTimeout(() => {
          const p = predictExoplanet(data.model_input);
          setConfidence(p);
          setLoadingStar(false);
        }, 220);
      });
  }, []);

  const isPlanet = confidence !== null && confidence > 0.5;
  const verdictColor = confidence === null ? "var(--text-faint)" : isPlanet ? "var(--planet)" : "var(--quiet)";

  return (
    <>
      <header style={{ borderBottom: "1px solid var(--line)", padding: "18px 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--accent)", fontSize: 18 }}>☼ ☾</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: 17 }}>Exoplanet Detector</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <section className="container" style={{ padding: "72px 28px 56px" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--accent)", letterSpacing: 1, marginBottom: 18 }}>
            A NEURAL NETWORK TRAINED ON REAL NASA KEPLER DATA
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(34px, 5.5vw, 56px)", lineHeight: 1.08, margin: "0 0 22px" }}>
            Choose a star. Watch the model read its light.
          </h1>
          <p style={{ fontSize: 17, color: "var(--text-dim)", lineHeight: 1.7, margin: 0 }}>
            Pick a star from NASA&rsquo;s Kepler survey and a small convolutional network — running
            live, right here in your browser — will judge whether its brightness hides a
            transiting planet. New to this? The background sections below explain the method.
          </p>
        </div>
      </section>

      {/* DETECTOR */}
      <section id="detector" className="container" style={{ padding: "0 28px 64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 22 }}>
          <span style={{ color: "var(--accent)" }}>☉</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, margin: 0 }}>Run the model on a real star</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 28 }} className="detector-grid">
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)", marginBottom: 10 }}>
              STAR CATALOG · {catalog.length} real Kepler samples
            </div>
            {catalog.length > 0 ? (
              <StarCatalog catalog={catalog} selectedId={selectedId} onSelect={selectStar} />
            ) : (
              <div style={{ color: "var(--text-faint)", fontSize: 13 }}>Loading catalog…</div>
            )}
          </div>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              background: "var(--bg-elevated)",
              padding: 24,
            }}
          >
            {warmingUp ? (
              <div style={{ color: "var(--text-faint)", fontFamily: "var(--mono)", fontSize: 13, padding: "60px 0", textAlign: "center" }}>
                Warming up the model…
              </div>
            ) : !starData ? (
              <div style={{ color: "var(--text-faint)", fontFamily: "var(--mono)", fontSize: 13, padding: "60px 0", textAlign: "center" }}>
                Select a star to analyse its light curve.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: 28 }} className="result-grid">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 20 }}>Sample {starData.id}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-faint)" }}>
                        Observed brightness over time
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        color: starData.label === 1 ? "var(--planet)" : "var(--text-faint)",
                        alignSelf: "flex-start",
                      }}
                    >
                      catalog says: {starData.label === 1 ? "confirmed KOI" : "no known planet"}
                    </div>
                  </div>
                  <LightCurveChart raw={starData.raw} accentColor={loadingStar ? "var(--text-faint)" : verdictColor} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <ConfidenceGauge
                    value={loadingStar ? null : confidence}
                    color={verdictColor}
                    label={loadingStar ? "computing…" : isPlanet ? "planet detected" : "no planet detected"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 40 }} className="info-grid">
          <InfoCard icon="☉" title="What is an exoplanet?" teaser="Worlds beyond our own Sun, found in the flicker of starlight.">
            <p>
              An <em>exoplanet</em> is any planet that orbits a star beyond our own Sun. The first
              was confirmed only in the 1990s; today astronomers know of thousands, with many more
              candidates awaiting confirmation. Each one is a clue to a simple, enormous question:
              how common are worlds like ours?
            </p>
            <p>
              Exoplanets range from scorching gas giants that hug their stars to small rocky
              worlds, icy Neptunes, and &ldquo;super-Earths.&rdquo; Some circle two suns at once; others
              drift through space with no star at all.
            </p>
            <p>
              Most are spotted by the <em>transit method</em>: the faint, repeating dip in a
              star&rsquo;s brightness as a planet passes in front of it. That dip is exactly the
              fingerprint this neural network learns to recognise. Studying these worlds reveals
              how planetary systems form, and how rare a planet like Earth truly is.
            </p>
          </InfoCard>
          <InfoCard icon="☼" title="How this model works" teaser="Four steps from a brightness signal to a single confidence number.">
            <p>1. It reads a <strong>light curve</strong> — a star&rsquo;s brightness measured at 3,197 points in time. This is a one-dimensional signal, like a heartbeat trace for a star.</p>
            <p>2. A <strong>convolutional neural network</strong> — the same family of model used for image recognition — slides small filters across that signal, learning to spot the faint, repeating dip in brightness that appears when a planet crosses in front of its star.</p>
            <p>3. During training it studied real Kepler light curves, each labelled planet or no planet, and gradually tuned itself to tell the two apart.</p>
            <p>4. For a new star it outputs a single number between 0 and 1 — its confidence that a transiting planet is present. Above 50% we call it a detection.</p>
            <p style={{ color: "var(--text-faint)", fontSize: 13 }}>
              Because each light curve here was pre-processed in a way that can&rsquo;t be exactly
              reproduced from raw telescope data, the detector runs only on the real Kepler samples
              bundled with the model. Every verdict is a genuine model output, computed live in your
              browser — not a simulation.
            </p>
          </InfoCard>
        </div>
      </section>

      {/* KNOWN WORLDS */}
      <section className="container" style={{ padding: "0 28px 64px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
          <span style={{ color: "var(--accent)" }}>✦</span>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, margin: 0 }}>Explore Known Worlds</h2>
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginTop: 10, marginBottom: 26 }}>
          These confirmed exoplanets were never part of the model&rsquo;s training data. Search a
          planet&rsquo;s name to pull its real-world dossier from the NASA Exoplanet Archive — verified
          discoveries, not model guesses.
        </p>
        <KnownWorlds />
      </section>

      {/* FUN FACTS */}
      <section className="container" style={{ padding: "0 28px 80px", maxWidth: 640 }}>
        <FunFacts />
      </section>

      <footer style={{ borderTop: "1px solid var(--line)", padding: "26px 0", marginTop: 20 }}>
        <div className="container" style={{ color: "var(--text-faint)", fontSize: 12.5, lineHeight: 1.7 }}>
          Predictions run on a convolutional neural network using light curves from NASA&rsquo;s Kepler
          mission, entirely in your browser. Catalog entries are real, de-identified survey samples.
        </div>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .detector-grid { grid-template-columns: 1fr !important; }
          .info-grid { grid-template-columns: 1fr !important; }
          .result-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
