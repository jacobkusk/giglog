import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: artist } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!artist) notFound();

  const { data: concerts } = await supabase
    .from("concerts")
    .select("*, venues(name, slug), festival_editions(year, festivals(name, slug))")
    .eq("artist_id", artist.id)
    .order("date", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold">{artist.name}</h1>
      {artist.bio && (
        <p className="text-[var(--color-muted)] mt-2 max-w-2xl">{artist.bio}</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Concert History</h2>
      {concerts && concerts.length > 0 ? (
        <div className="grid gap-3">
          {concerts.map((c) => {
            const festivalName = c.festival_editions?.festivals?.name;
            const festivalSlug = c.festival_editions?.festivals?.slug;
            const festivalYear = c.festival_editions?.year;

            return (
              <div
                key={c.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{c.title}</span>
                    {c.stage && (
                      <span className="text-sm text-[var(--color-primary)] ml-2">{c.stage}</span>
                    )}
                  </div>
                  <span className="text-sm text-[var(--color-muted)]">
                    {new Date(c.date).toLocaleDateString("en-DK", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <div className="text-sm text-[var(--color-muted)] mt-1">
                  {festivalName && festivalSlug && festivalYear ? (
                    <Link href={`/festivals/${festivalSlug}/${festivalYear}`} className="hover:text-[var(--color-foreground)] transition">
                      {festivalName} {festivalYear}
                    </Link>
                  ) : c.venues?.name ? (
                    <span>{c.venues.name}</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[var(--color-muted)]">No concerts logged yet.</p>
      )}
    </div>
  );
}
