import { PageTransition } from "@/components/PageTransition";

/** Solo el documento del capítulo: el layout (sidebar) no remonta. */
export default function PlaybookTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
