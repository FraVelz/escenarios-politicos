import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { readPlaybook } from "@/lib/playbook";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function PlaybookDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const md = readPlaybook(slug);
  if (!md) notFound();

  return (
    <main>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
        <Link href="/playbook">
          <ArrowLeft />
          Playbook
        </Link>
      </Button>
      <Card>
        <CardContent className="p-5 sm:p-6">
          <article className="prose-dashboard">
            <pre className="m-0 whitespace-pre-wrap border-0 bg-transparent p-0 font-sans text-sm leading-relaxed text-foreground">
              {md}
            </pre>
          </article>
        </CardContent>
      </Card>
    </main>
  );
}
