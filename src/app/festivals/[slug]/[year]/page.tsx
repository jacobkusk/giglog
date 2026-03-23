import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FestivalYearPage({ params }: { params: Promise<{ slug: string; year: string }> }) {
  const { slug, year } = await params;
  const supabase = await createClient();

  const { data: festival } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!festival) notFound();

  const { data: edition } = await supabase
    .from("festival_editions")
    .select("*")
    .eq("festival_id", festival.id)
    .eq("year", parseInt(year))
    .single();

  if (!edition) notFound();

  const { data: concerts } = await supabase
    .from("concerts")
    .select("*, artists(name, slug), venues(name)")
    .eq("festival_edition_id", edition.id)
    .order("date")
    .order("stage");

  // Group by stage
  const stages: Record<string, typeof concerts> = {};
  for (const c of concerts ?? []) {
    const stage = c.stage || "Other";
    if (!stages[stage]) stages[stage] = [];
    stages[stage].push(c);
  }

  return (
    <div>
      <Link href={`/festivals/${slug}`} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition">
        &larr; {festival.name}
      </Link>

      <h1 className="text-3xl font-bold mt-3">
        <span className="text-[var(--color-primary)]">{festival.name}</span> {year}
      </h1>

      {edition.start_date && edition.end_date && (
        <p className="text-[var(--color-muted)] mt-1">
          {new Date(edition.start_date).toLocaleDateString("en-DK", { month: "long", day: "numeric" })}
          {" – "}
          {new Date(edition.end_date).toLocaleDateString("en-DK", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}

      <div className="mt-8 space-y-8">
        {Object.entries(stages).map(([stage, concerts]) => (
          <div key={stage}>
            <h2 className="text-lg font-bold text-[var(--color-primary)] mb-3">{stage}</h2>
            <div className="grid gap-2">
              {concerts?.map((c) => (
                <Link
                  key={c.id}
                  href={`/artists/${c.artists?.slug}`}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 hover:bg-[var(--color-surface-hover)] transition"
                >
                  <span className="font-medium">{c.artists?.name}</span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {new Date(c.date).toLocaleDateString("en-DK", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
