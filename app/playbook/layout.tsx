import Link from "next/link";
import { PLAYBOOK_FILES, playbookLabel, playbookSlug } from "@/lib/playbook";
import { PlaybookSidebar } from "@/components/PlaybookSidebar";
import { focusRingInline } from "@/lib/focus";
import { cn } from "@/lib/utils";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = PLAYBOOK_FILES.map((f) => ({
    slug: playbookSlug(f),
    file: f,
    label: playbookLabel(f),
  }));

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <Link
            href="/playbook"
            className={cn(
              "rounded-sm text-foreground no-underline hover:text-foreground",
              focusRingInline,
            )}
          >
            Playbook Colombia
          </Link>
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Manual del agente: datos, discurso, credibilidad, escenarios.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <PlaybookSidebar items={items} />
        <div className="min-w-0 flex-1" role="region" aria-label="Documento">
          {children}
        </div>
      </div>
    </main>
  );
}
