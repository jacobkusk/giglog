import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FestivalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: festival } = await supabase
    .from("festivals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!festival) notFound();

  const { data: editions } = await supabase
    .from("festival_editions")
    .select("*")
    .eq("festival_id", festival.id)
    .order("year", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold">
        <span className="text-[var(--color-primary)]">{festival.name}</span>
      </h1>
      <p className="text-[var(--color-muted)] mt-1">
        {festival.city}, {festival.country}
      </p>
      {festival.description && (
        <p className="text-sm text-[var(--color-muted)] mt-3 max-w-2xl">{festival.description}</p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Editions</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {editions?.map((e) => (
          <Link
            key={e.id}
            href={`/festivals/${slug}/${e.year}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:bg-[var(--color-surface-hover)] transition"
          >
            <div className="text-2xl font-bold text-[var(--color-primary)]">{e.year}</div>
            {e.start_date && e.end_date && (
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {new Date(e.start_date).toLocaleDateString("en-DK", { month: "short", day: "numeric" })}
                {" – "}
                {new Date(e.end_date).toLocaleDateString("en-DK", { month: "short", day: "numeric" })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
