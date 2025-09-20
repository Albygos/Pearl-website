import Link from 'next/link';
import { Paintbrush } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline tracking-tight", className)}>
      <Image src="https://upload.wikimedia.org/wikipedia/en/e/e3/Kcym_state_logo.png" alt="Pearl 2025 Logo" width={40} height={40} className="rounded-md" />
      <span>Pearl 2025</span>
    </Link>
  );
}
