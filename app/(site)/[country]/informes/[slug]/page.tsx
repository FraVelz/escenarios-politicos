import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { MarkdownEvidence } from "@/components/MarkdownEvidence";
import { markdownToHtml } from "@/lib/markdown";

export default async function InformeDetailPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { slug } = await params;
  const filePath = `content/informes/${slug}.md`;
  const abs = path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) notFound();
  const md = fs.readFileSync(abs, "utf8");
  const html = await markdownToHtml(md);

  return (
    <main>
      <PageHeader title={slug} description="Informe estático con metodología y límites." />
      <MarkdownEvidence markdown={md} html={html} file={filePath} />
    </main>
  );
}
