import DOMPurify from "isomorphic-dompurify";

/** Sanitiza HTML (server o client). */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
