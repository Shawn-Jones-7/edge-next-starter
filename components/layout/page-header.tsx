import { cn } from '@/lib/utils/index';

import { Container } from './container';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <section className={cn('border-b border-border/40 bg-muted/30 py-12 md:py-16', className)}>
      <Container>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-muted-foreground md:text-xl">{description}</p>
        )}
      </Container>
    </section>
  );
}
