import { listCasosSync } from "@/lib/data";
import { CasosPageClient } from "@/components/CasosPageClient";

export default async function CasosPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const all = listCasosSync(country);
  return <CasosPageClient all={all} />;
}
