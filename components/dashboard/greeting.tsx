function greetingForHour(hour: number): string {
  if (hour < 6) return "¡Buenas noches!";
  if (hour < 13) return "¡Buenos días!";
  if (hour < 20) return "¡Buenas tardes!";
  return "¡Buenas noches!";
}

export function Greeting({ now }: { now: number }) {
  const hour = now > 0 ? new Date(now).getHours() : 12;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{greetingForHour(hour)}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sigamos haciendo crecer tu negocio.</p>
    </div>
  );
}
