import { notFound } from "next/navigation";
import { isCountryAvailableSync, getPaisMeta } from "@/lib/countries";

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  if (!isCountryAvailableSync(country)) {
    notFound();
  }
  // Touch meta for future use (locale, etc.)
  void getPaisMeta(country);

  return children;
}
