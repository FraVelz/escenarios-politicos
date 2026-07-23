export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-border px-4 py-8 sm:px-6">
      <p className="text-base font-medium text-white">{title}</p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
