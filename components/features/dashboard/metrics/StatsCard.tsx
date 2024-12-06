interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}

export function StatsCard({ title, value, subtitle, icon }: StatsCardProps) {
  return (
    <div className="relative rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-semibold">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
      </div>
    </div>
  );
}
