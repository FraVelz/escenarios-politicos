"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Code2, Copy, Eye } from "lucide-react";
import { easeOut } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { focusRingNav } from "@/lib/focus";
import { cn } from "@/lib/utils";

type Mode = "preview" | "codigo";

/**
 * Evidencia markdown: switcher Preview | Código (con copiar).
 * Usar en playbook, fuentes, escenarios y cualquier doc de metodología.
 */
export function MarkdownEvidence({
  markdown,
  html,
  title,
  file,
  className,
  defaultMode = "preview",
}: {
  markdown: string;
  html: string;
  title?: string;
  file?: string;
  className?: string;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();

  async function copySource() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn("min-w-0", className)}>
      {(title || file) && (
        <header className="mb-4">
          {title && (
            <h2 className="text-base font-medium tracking-tight text-white">
              {title}
            </h2>
          )}
          {file && (
            <p className="font-mono text-[11px] text-iris">{file}</p>
          )}
        </header>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div
          className="inline-flex border-b border-border"
          role="tablist"
          aria-label="Vista del documento"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "preview"}
            onClick={() => setMode("preview")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-xs font-medium transition-colors duration-150",
              focusRingNav,
              mode === "preview"
                ? "border-primary text-white"
                : "text-muted-foreground hover:text-white",
            )}
          >
            <Eye className="size-3.5" aria-hidden />
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "codigo"}
            onClick={() => setMode("codigo")}
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-xs font-medium transition-colors duration-150",
              focusRingNav,
              mode === "codigo"
                ? "border-primary text-white"
                : "text-muted-foreground hover:text-white",
            )}
          >
            <Code2 className="size-3.5" aria-hidden />
            Código
          </button>
        </div>

        {mode === "codigo" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copySource}
            className={cn("h-7 gap-1.5 px-2 text-xs", focusRingNav)}
            aria-label={copied ? "Copiado" : "Copiar markdown"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "ok" : "copy"}
                className="inline-flex items-center gap-1.5"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-ok" aria-hidden />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden />
                    Copiar
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {mode === "preview" ? (
          <motion.div
            key="preview"
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
          >
            <article
              className="prose prose-invert max-w-none text-sm leading-relaxed prose-headings:font-medium prose-a:text-iris-glow prose-code:rounded-none prose-code:border prose-code:border-border prose-code:bg-transparent prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-iris prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-none prose-pre:border prose-pre:border-border prose-pre:bg-black"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="codigo"
            role="tabpanel"
            initial={reduce ? false : { opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: reduce ? 0 : 0.2, ease: easeOut }}
          >
            <pre className="whitespace-pre-wrap break-words rounded-none border border-border bg-black p-5 font-mono text-xs leading-relaxed text-bone">
              {markdown}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
