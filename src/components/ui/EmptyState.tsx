export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="surface-panel px-6 py-14 text-center" role="status">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{description}</p>}
    </div>
  );
}
