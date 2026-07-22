import Link from "next/link";
import { notFound } from "next/navigation";
import { readPlaybook } from "@/lib/playbook";

export default async function PlaybookDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const md = readPlaybook(slug);
  if (!md) notFound();

  return (
    <main>
      <p>
        <Link href="/playbook">← Playbook</Link>
      </p>
      <article className="prose panel">
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{md}</pre>
      </article>
    </main>
  );
}
