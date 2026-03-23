import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function FestivalsPage() {
  const supabase = await createClient();
  const { data: festivals } = await supabase
    .from("festivals")
    .select("*, festival_editions(year)")
    .order("name");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Festivals</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {festivals?.map((f) => (
          <Link
            key={f.id}
            href={`/festivals/${f.slug}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:bg-[var(--color-surface-hover)] transition"
          >
            <h2 className="text-xl font-bold">{f.name}</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {f.city}, {f.country}
            </p>
            <p className="text-sm text-[var(--color-muted)] mt-2">
              {f.festival_editions?.length} editions
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
