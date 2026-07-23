import Link from "next/link";
import { redirect } from "next/navigation";
import { listAvailableCountriesSync } from "@/lib/countries";

export default function RootPage() {
  const countries = listAvailableCountriesSync();

  if (countries.length === 1) {
    redirect(`/${countries[0].id}`);
  }

  if (countries.length === 0) {
    return (
      <main>
        <h1 className="text-2xl font-medium text-white">Sin países con datos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No hay casos ni marco analizado en seed/Firestore.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1 className="mb-4 text-2xl font-medium tracking-tight text-white">
        Elegir país
      </h1>
      <p className="mb-6 max-w-xl text-sm text-muted-foreground">
        Solo aparecen países con datos analizados.
      </p>
      <ul className="space-y-2">
        {countries.map((c) => (
          <li key={c.id}>
            <Link
              href={`/${c.id}`}
              className="text-base text-bone no-underline hover:text-white"
            >
              {c.nombre} →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
