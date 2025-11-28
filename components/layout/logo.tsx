import { Link } from '@/i18n/navigation';

import { cn } from '@/lib/utils/index';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      {/* Logo icon - simple geometric shape like Vercel's triangle */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M12 2L2 19.5H22L12 2Z" fill="currentColor" />
      </svg>
      {showText && <span className="text-lg font-semibold tracking-tight">B2B</span>}
    </Link>
  );
}
