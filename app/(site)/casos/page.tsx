import { listCasosSync } from "@/lib/data";
import { CasosPageClient } from "@/components/CasosPageClient";

export default function CasosPage() {
  const all = listCasosSync();
  return <CasosPageClient all={all} />;
}
