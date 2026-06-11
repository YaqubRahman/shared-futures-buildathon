"use client";

import { useEffect, useRef, useState } from "react";
import { businesses } from "../data/businesses";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";

type Business = any;

export default function Map() {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Business | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return;
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: false }).setView(
      [51.515, -0.09],
      13,
    );

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap © CARTO",
      },
    ).addTo(map);

    mapRef.current = map;

    businesses.forEach((b: any) => {
      let marker;

      if (b.isChain && b.logo) {
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:44px;
            height:44px;
            border-radius:8px;
            background:white;
            border:2px solid #ef4444;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            overflow:hidden;
            padding:3px;
          ">
            <img src="${b.logo}" style="width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none'" />
          </div>`,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
        marker = L.marker([b.lat, b.lng], { icon }).addTo(map);
      } else {
        marker = L.circleMarker([b.lat, b.lng], {
          radius: 8,
          fillColor:
            b.ethicalScore >= 4
              ? "#22c55e"
              : b.ethicalScore >= 3.5
                ? "#f59e0b"
                : "#ef4444",
          color: "white",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);
      }

      marker.on("click", () => {
        setSelected(b);
        setUserRating(null);
        setSubmitted(false);
      });
    });
  }, []);

  const handleSubmit = () => {
    if (userRating) setSubmitted(true);
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "#0f172a",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ color: "#22c55e", fontWeight: 800, fontSize: "20px" }}>
          ◈
        </span>
        <span style={{ color: "white", fontWeight: 700, fontSize: "18px" }}>
          Rooted
        </span>
        <span style={{ color: "#94a3b8", fontSize: "13px", marginLeft: "8px" }}>
          Discover businesses you can trust
        </span>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "16px",
          zIndex: 1000,
          background: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontWeight: 700,
            fontSize: "11px",
            color: "#0f172a",
          }}
        >
          ETHICAL SCORE
        </p>
        {[
          { color: "#22c55e", label: "High (4.0+)" },
          { color: "#f59e0b", label: "Medium (3.5+)" },
          { color: "#ef4444", label: "Lower (below 3.5)" },
        ].map(({ color, label }) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: color,
                border: "2px solid white",
                boxShadow: "0 0 0 1px #e2e8f0",
              }}
            />
            <span style={{ fontSize: "12px", color: "#475569" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div ref={containerRef} style={{ height: "100vh", width: "100%" }} />

      {/* Side Panel */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            width: "320px",
            background: "white",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
            overflowY: "auto",
            paddingTop: "60px",
            borderRadius: "30px 0 0 30px",
          }}
        >
          <div style={{ padding: "20px" }}>
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#64748b",
              }}
            >
              ✕
            </button>

            {/* Logo for chains */}
            {selected.isChain && selected.logo && (
              <div style={{ marginBottom: "12px" }}>
                <img
                  src={selected.logo}
                  style={{ height: "40px", objectFit: "contain" }}
                />
              </div>
            )}

            <h2
              style={{ margin: "0 0 4px", fontSize: "22px", color: "#0f172a" }}
            >
              {selected.name}
            </h2>
            <p
              style={{ margin: "0 0 4px", color: "#64748b", fontSize: "14px" }}
            >
              {selected.category}
            </p>
            {selected.address && (
              <p
                style={{
                  margin: "0 0 16px",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                {selected.address}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "20px",
              }}
            >
              {selected.tags.map((tag: string) => (
                <span
                  key={tag}
                  style={{
                    background: selected.isChain ? "#fef2f2" : "#f0fdf4",
                    color: selected.isChain ? "#991b1b" : "#16a34a",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Scores */}
            <div
              style={{
                background: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#475569" }}>
                    Foundation Score
                  </span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {selected.ethicalScore}/5
                  </span>
                </div>
                <div
                  style={{
                    background: "#e2e8f0",
                    borderRadius: "4px",
                    height: "6px",
                  }}
                >
                  <div
                    style={{
                      background:
                        selected.ethicalScore >= 4
                          ? "#22c55e"
                          : selected.ethicalScore >= 3
                            ? "#f59e0b"
                            : "#ef4444",
                      width: `${(selected.ethicalScore / 5) * 100}%`,
                      height: "6px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#475569" }}>
                    Community Score
                  </span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {submitted && userRating
                      ? ((selected.communityScore + userRating) / 2).toFixed(1)
                      : selected.communityScore}
                    /5
                  </span>
                </div>
                <div
                  style={{
                    background: "#e2e8f0",
                    borderRadius: "4px",
                    height: "6px",
                  }}
                >
                  <div
                    style={{
                      background: "#3b82f6",
                      width: `${(selected.communityScore / 5) * 100}%`,
                      height: "6px",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Ethical Criteria */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: "13px",
                  color: "#0f172a",
                  marginBottom: "10px",
                }}
              >
                ETHICAL CRITERIA
              </p>
              {[
                {
                  label: "Halal Certified",
                  pass: selected.tags.includes("halal"),
                },
                {
                  label: "HMC Certified",
                  pass: selected.hmcCertified === true,
                },
                {
                  label: "Alcohol Free",
                  pass: selected.servesAlcohol === false,
                },
                { label: "Independently Owned", pass: !selected.parentCompany },
                ...(selected.halalAvailable !== undefined
                  ? [
                      {
                        label: "Halal Range Available",
                        pass: selected.halalAvailable === true,
                      },
                    ]
                  : []),
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#475569" }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: "16px" }}>
                    {c.pass ? "✅" : "❌"}
                  </span>
                </div>
              ))}
            </div>

            {/* Ethical Concerns */}
            {selected.ethicalConcerns && (
              <div
                style={{
                  background: "#fff7ed",
                  borderRadius: "12px",
                  padding: "12px",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#92400e",
                    margin: "0 0 4px",
                  }}
                >
                  ⚠ CONCERNS
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#92400e",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {selected.ethicalConcerns}
                </p>
              </div>
            )}

            {/* Israel Links */}
            {selected.israelLinks && (
              <div
                style={{
                  background: "#fef2f2",
                  borderRadius: "12px",
                  padding: "12px",
                  marginBottom: "20px",
                  borderLeft: "3px solid #ef4444",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#991b1b",
                    margin: "0 0 4px",
                  }}
                >
                  🔴 ISRAEL & SETTLEMENTS
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#7f1d1d",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  {selected.israelLinks}
                </p>
              </div>
            )}

            {/* Opening Hours */}
            {selected.openingHours && (
              <div
                style={{
                  marginBottom: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "12px",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#0f172a",
                    margin: "0 0 4px",
                  }}
                >
                  OPENING HOURS
                </p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                  {selected.openingHours}
                </p>
              </div>
            )}

            {/* Website */}
            {selected.website && (
              <a
                href={selected.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: "20px",
                  padding: "10px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Visit Website →
              </a>
            )}

            {/* Community Rating */}
            {!submitted ? (
              <div
                style={{
                  background: "#fafafa",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: "13px",
                    color: "#0f172a",
                    marginBottom: "10px",
                  }}
                >
                  RATE THIS PLACE
                </p>
                <div
                  style={{ display: "flex", gap: "8px", marginBottom: "12px" }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setUserRating(n)}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border:
                          userRating === n
                            ? "2px solid #22c55e"
                            : "2px solid #e2e8f0",
                        background: userRating === n ? "#f0fdf4" : "white",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontSize: "14px",
                        color: userRating === n ? "#16a34a" : "#64748b",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Submit Rating
                </button>
              </div>
            ) : (
              <div
                style={{
                  background: "#f0fdf4",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#16a34a", fontWeight: 700, margin: 0 }}>
                  ✓ Thanks for rating!
                </p>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    margin: "4px 0 0",
                  }}
                >
                  Community score updated
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
