import { notFound } from "next/navigation";
import { PlaybookDocView } from "@/components/PlaybookDocView";
import { markdownToHtml } from "@/lib/markdown";
import {
  PLAYBOOK_FILES,
  playbookLabel,
  playbookSlug,
  readPlaybook,
} from "@/lib/playbook";

export default async function PlaybookDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const md = readPlaybook(slug);
  if (!md) notFound();

  const file = PLAYBOOK_FILES.find((f) => playbookSlug(f) === slug)!;
  const html = await markdownToHtml(md);

  return (
    <PlaybookDocView
      title={playbookLabel(file)}
      file={file}
      markdown={md}
      html={html}
    />
  );
}
