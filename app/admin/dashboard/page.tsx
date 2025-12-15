export default function Page() {
  return (
    <div className="flex flex-col flex-1 gap-4 p-4">
      <div className="gap-4 grid md:grid-cols-3 auto-rows-min">
        <div className="bg-muted/50 rounded-xl aspect-video" />
        <div className="bg-muted/50 rounded-xl aspect-video" />
        <div className="bg-muted/50 rounded-xl aspect-video" />
      </div>
      <div className="flex-1 bg-muted/50 rounded-xl md:min-h-min" />
    </div>
  );
}
