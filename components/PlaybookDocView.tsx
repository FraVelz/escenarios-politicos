"use client";

import { MarkdownEvidence } from "@/components/MarkdownEvidence";
import { Reveal } from "@/components/motion";

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
    <Reveal y={14} delay={0.05}>
      <MarkdownEvidence
        title={title}
        file={file}
        markdown={markdown}
        html={html}
      />
    </Reveal>
  );
}
