import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero with poster wall background */}
      <section className="relative -mx-4 -mt-8 overflow-hidden" style={{ minHeight: 520 }}>
        {/* Poster wall photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/hero-posters.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.1) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center" style={{ minHeight: 520, padding: "60px 20px" }}>
          <h1 className="text-5xl font-bold tracking-tight" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}>
            <span className="text-[var(--color-primary)]">Gig</span>Log
          </h1>
          <p className="mt-4 text-xl" style={{ color: "#e5e7eb", textShadow: "0 1px 10px rgba(0,0,0,0.9)" }}>
            Your concert diary. Rate it. Share it. Remember it.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-[var(--color-primary)] px-6 py-3 font-semibold text-black hover:bg-[var(--color-primary-dark)] transition"
            >
              Get Started
            </Link>
            <Link
              href="/concerts"
              className="rounded-lg border border-[var(--color-border)] px-6 py-3 font-semibold hover:bg-[var(--color-surface)] transition"
              style={{ backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.3)" }}
            >
              Browse Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Concerts", description: "Log every gig. Rate performance, vibe, venue, and sound.", href: "/concerts" },
          { title: "Artists", description: "Discover artists. See their tour history and ratings.", href: "/artists" },
          { title: "Venues", description: "Explore venues. Find the best stages and sound.", href: "/venues" },
          { title: "Profile", description: "Your concert timeline. Photos, reviews, friends.", href: "/profile" },
        ].map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:bg-[var(--color-surface-hover)] transition"
          >
            <h2 className="text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{feature.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
