import { cn } from '@/lib/utils/index';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group rounded-lg border border-border/40 bg-card p-6 transition-all hover:border-border hover:shadow-sm',
        className
      )}
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
