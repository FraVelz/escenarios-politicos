"use client";

import { MarkdownEvidence } from "@/components/MarkdownEvidence";

/** Wrapper playbook: título + switcher Preview/Código */
export function PlaybookDocView({
  title,
  file,
  markdown,
  html,
}: {
  title: string;
  file: string;
  markdown: string;
  html: string;
}) {
  return (
    <MarkdownEvidence
      title={title}
      file={file}
      markdown={markdown}
      html={html}
    />
  );
}
