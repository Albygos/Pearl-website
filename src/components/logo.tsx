import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-2xl font-bold font-headline tracking-tight", className)}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-yellow-500">
        Pearl 2025
      </span>
    </Link>
  );
}
