"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} style={{
      fontSize: 14,
      fontWeight: active ? 600 : 500,
      color: active ? "#fff" : "#9ca3af",
      textDecoration: "none",
      padding: "5px 14px",
      borderRadius: 8,
      background: active ? "rgba(249,115,22,0.15)" : "transparent",
      transition: "background 0.15s, color 0.15s",
      whiteSpace: "nowrap" as const,
    }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = "#fff"; } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#9ca3af"; } }}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      if (u) loadName(u.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user ?? null);
      if (s?.user) loadName(s.user.id);
      else setDisplayName(null);
    });

    const handler = () => {
      supabase.auth.getUser().then(({ data: { user: u } }) => {
        if (u) loadName(u.id);
      });
    };
    window.addEventListener("profile-updated", handler);
    return () => { subscription.unsubscribe(); window.removeEventListener("profile-updated", handler); };
  }, []);

  async function loadName(userId: string) {
    const { data } = await supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle();
    setDisplayName(data?.display_name ?? null);
  }

  const name = displayName || user?.email?.split("@")[0] || null;

  const isConcerts = pathname.startsWith("/concerts");
  const isFestivals = pathname.startsWith("/festivals");
  const isArtists = pathname.startsWith("/artists");
  const isVenues = pathname.startsWith("/venues");
  const isPinboard = pathname.startsWith("/pinboard");

  const mobileLinks = [
    { href: "/concerts", label: "Concerts" },
    { href: "/festivals", label: "Festivals" },
    { href: "/artists", label: "Artists" },
    { href: "/venues", label: "Venues" },
    { href: "/pinboard", label: "Pinboard" },
  ];

  return (
    <>
      <header style={{
        background: "#111",
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", color: "#f97316" }}>
              Gig
            </span>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff" }}>
              Log
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="giglog-nav-desktop" style={{ display: "flex", gap: 2, alignItems: "center" }}>
            <NavLink href="/concerts" label="Concerts" active={isConcerts} />
            <NavLink href="/festivals" label="Festivals" active={isFestivals} />
            <NavLink href="/artists" label="Artists" active={isArtists} />
            <NavLink href="/venues" label="Venues" active={isVenues} />
            <NavLink href="/pinboard" label="Pinboard" active={isPinboard} />
          </nav>

          {/* Desktop right */}
          <div className="giglog-nav-desktop" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user ? (
              <div style={{ position: "relative" }}
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}>
                <div style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {name}
                </div>
                {profileOpen && (
                  <div style={{ position: "absolute", right: 0, top: "100%", paddingTop: 4, zIndex: 200, minWidth: 160 }}>
                    <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                      <Link href="/profile" style={{ display: "block", padding: "10px 16px", fontSize: 13, color: "#e5e7eb", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>My Profile</Link>
                      <Link href="/my-logs" style={{ display: "block", padding: "10px 16px", fontSize: 13, color: "#e5e7eb", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>My Logs</Link>
                      <div style={{ borderTop: "1px solid #333" }} />
                      <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
                        style={{ display: "block", width: "100%", padding: "10px 16px", fontSize: 13, color: "#ef4444", background: "none", border: "none", textAlign: "left" as const, cursor: "pointer", fontFamily: "inherit" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>Sign out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: "#f97316", textDecoration: "none", padding: "6px 16px", borderRadius: 8, border: "1.5px solid rgba(249,115,22,0.4)" }}>
                Log in
              </Link>
            )}
          </div>

          {/* Mobile right */}
          <div className="giglog-nav-mobile" style={{ display: "none", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column" as const, gap: 5 }}
            >
              <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "transform 0.2s", transform: mobileOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ display: "block", width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "transform 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="giglog-nav-mobile" style={{ display: "block", position: "fixed" as const, top: 56, left: 0, right: 0, bottom: 0, background: "#111", zIndex: 99, overflowY: "auto" as const }}>
          <div style={{ padding: "8px 0 24px" }}>
            {mobileLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "14px 24px", fontSize: 15, fontWeight: 600, color: "#e5e7eb", textDecoration: "none", borderBottom: "1px solid #222" }}>
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #222", marginTop: 8, padding: "8px 0" }}>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>My Profile</Link>
                  <Link href="/my-logs" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontSize: 14, color: "#9ca3af", textDecoration: "none" }}>My Logs</Link>
                  <button onClick={() => { supabase.auth.signOut().then(() => router.push("/")); setMobileOpen(false); }}
                    style={{ display: "block", width: "100%", padding: "14px 24px", fontSize: 14, color: "#ef4444", background: "none", border: "none", textAlign: "left" as const, cursor: "pointer", fontFamily: "inherit" }}>
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "14px 24px", fontSize: 15, fontWeight: 600, color: "#f97316", textDecoration: "none" }}>Log in</Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .giglog-nav-desktop { display: none !important; }
          .giglog-nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
