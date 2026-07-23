import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { sanitizeHtml } from "@/lib/sanitize-html";

/** Markdown → HTML sanitizado (sin scripts/handlers). */
export async function markdownToHtml(md: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHtml).process(md);
  return sanitizeHtml(String(result));
}
