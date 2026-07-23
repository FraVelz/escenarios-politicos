import fs from "fs";
import path from "path";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { countryPath } from "@/lib/countries";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export default async function InformesPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const dir = path.join(process.cwd(), "content/informes");
  const files = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".md") && f.startsWith(country === "co" ? "colombia" : country))
        .sort()
        .reverse()
    : [];

  return (
    <main>
      <PageHeader
        title="Informes"
        description="Snapshots analíticos con fuentes y límites. No sustituyen el tablero vivo."
      />
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">N/D — sin informes en content/informes.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {files.map((f) => (
            <li key={f} className="py-4">
              <Link
                href={countryPath(country, `/informes/${f.replace(/\.md$/, "")}`)}
                className={cn(
                  "text-base text-white no-underline hover:text-iris-glow",
                  focusRingInline,
                )}
              >
                {f.replace(/\.md$/, "")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
