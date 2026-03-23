"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

type Photo = {
  url: string;
  artist: string;
  venue: string;
  caption: string;
};

const TAGS = [
  { key: null, label: "All" },
  { key: "festivals", label: "Festivals" },
  { key: "clubs", label: "Clubs" },
  { key: "arenas", label: "Arenas" },
];

// Test concert photos from Unsplash
const DEMO_PHOTOS: Photo[] = [
  { url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600", artist: "Festival Stage", venue: "Open Air", caption: "Main stage at sunset" },
  { url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600", artist: "Guitar Solo", venue: "Club Venue", caption: "Electric guitar in the spotlight" },
  { url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600", artist: "Crowd Energy", venue: "Arena", caption: "The crowd goes wild" },
  { url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600", artist: "Stage Lights", venue: "Festival Ground", caption: "Laser show spectacular" },
  { url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600", artist: "Festival Crowd", venue: "Open Field", caption: "Sea of people at golden hour" },
  { url: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600", artist: "DJ Set", venue: "Night Club", caption: "Bass drops at midnight" },
  { url: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600", artist: "Rock Band", venue: "Concert Hall", caption: "Full band on stage" },
  { url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600", artist: "Singer", venue: "Intimate Venue", caption: "Vocals under blue light" },
  { url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600", artist: "Drummer", venue: "Music Hall", caption: "Keeping the beat alive" },
  { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600", artist: "Festival Night", venue: "Festival Park", caption: "Neon lights and confetti" },
  { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600", artist: "Fireworks Show", venue: "Stadium", caption: "Grand finale pyrotechnics" },
  { url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600", artist: "Dance Floor", venue: "Club", caption: "Lost in the music" },
  { url: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600", artist: "Acoustic Set", venue: "Small Bar", caption: "Stripped back and raw" },
  { url: "https://images.unsplash.com/photo-1468164016595-6108e4a8c428?w=600", artist: "Synthwave", venue: "Underground Club", caption: "Retro vibes" },
  { url: "https://images.unsplash.com/photo-1571266028243-3716a5b4d402?w=600", artist: "Orchestra", venue: "Symphony Hall", caption: "Classical meets modern" },
  { url: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=600", artist: "Rap Show", venue: "Warehouse", caption: "Mic check one two" },
  { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600", artist: "Piano Keys", venue: "Jazz Club", caption: "Ivory and ebony" },
  { url: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600", artist: "Outdoor Gig", venue: "Park Stage", caption: "Music in nature" },
  { url: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600", artist: "Metal Show", venue: "Dive Bar", caption: "Wall of sound" },
  { url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600", artist: "Folk Band", venue: "Barn Venue", caption: "Strings and stories" },
];

/* SVG icon helpers */
const HeartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function PinboardClient() {
  const [photos] = useState<Photo[]>(DEMO_PHOTOS);
  const [tag, setTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const filtered = photos.filter(() => {
    // Tags and search filtering placeholder for when real data is wired up
    return true;
  });

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Keyboard support: Escape, Arrow keys
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowRight") setLightboxIndex(prev => prev !== null && prev < filtered.length - 1 ? prev + 1 : prev);
      else if (e.key === "ArrowLeft") setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filtered.length]);

  const lightboxPhoto = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const toggleLike = (url: string) => {
    setLikedPhotos(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url); else next.add(url);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui, sans-serif", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 40px" }}>
        {/* Header */}
        <div style={{ padding: "20px 0 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>
              Pinboard
            </h1>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>
              {filtered.length} concert photos
            </p>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          {TAGS.map(t => (
            <button
              key={t.key ?? "all"}
              onClick={() => setTag(t.key)}
              style={{
                fontSize: 12,
                fontWeight: tag === t.key ? 600 : 400,
                padding: "4px 10px",
                borderRadius: 12,
                border: tag === t.key ? "2px solid #f97316" : "1.5px solid #444",
                background: tag === t.key ? "#f97316" : "transparent",
                color: tag === t.key ? "#000" : "#9ca3af",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, alignItems: "center" }}>
          <form onSubmit={(e) => { e.preventDefault(); setActiveSearch(searchQuery.trim()); }} style={{ display: "flex", gap: 6, width: "50%" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search artists, venues..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: "8px 14px",
                borderRadius: 10,
                border: "1.5px solid #333",
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                background: "#1a1a1a",
                color: "#fff",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1.5px solid #f97316",
                background: "transparent",
                color: "#f97316",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Search
            </button>
          </form>
          {activeSearch && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); setActiveSearch(""); }}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #333",
                background: "transparent",
                color: "#9ca3af",
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Masonry grid */}
        <div
          style={{ columnCount: 4, columnGap: 12 }}
          className="pinboards-grid"
        >
          {filtered.map((photo, i) => (
            <div
              key={`${photo.url}-${i}`}
              style={{
                breakInside: "avoid",
                marginBottom: 12,
                borderRadius: 14,
                overflow: "hidden",
                background: "#1a1a1a",
                border: "1px solid #222",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
              }}
              onClick={() => setLightboxIndex(i)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                style={{
                  width: "100%",
                  display: "block",
                  minHeight: 120,
                  objectFit: "cover",
                  background: "#222",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setLightboxIndex(null); }}
        >
          {/* Navigation arrows */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
                width: 44, height: 44, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)", transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}
          {lightboxIndex < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              style={{
                position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
                width: 44, height: 44, cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)", transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%",
              width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#fff", backdropFilter: "blur(8px)",
            }}
          >
            <CloseIcon />
          </button>

          {/* Image */}
          <img
            src={lightboxPhoto.url.replace("w=600", "w=1200")}
            alt={lightboxPhoto.caption}
            style={{ maxWidth: "90vw", maxHeight: "75vh", borderRadius: 12, objectFit: "contain" }}
          />

          {/* Info bar */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{lightboxPhoto.artist}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>{lightboxPhoto.venue} &middot; {lightboxPhoto.caption}</div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(lightboxPhoto.url); }}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 8,
                color: likedPhotos.has(lightboxPhoto.url) ? "#ef4444" : "#9ca3af",
                transition: "color 0.15s",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={likedPhotos.has(lightboxPhoto.url) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .pinboards-grid { column-count: 2 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .pinboards-grid { column-count: 3 !important; }
        }
      `}</style>
    </div>
  );
}
