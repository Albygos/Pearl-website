import Link from 'next/link';
import { Paintbrush } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-xl font-bold font-headline tracking-tight", className)}>
      <Image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAMfSURBVHhe7ZxLyxRBFMa3gYhg0sSgREU86EFB9KALHwQRUXxQUfHgoCgeJCiIoCgeNBFEFA8eBL3pxYsoHkQ86Amoro+iKAY1g71xZ1U3s5PZnZmdZ3pghj+6q6q6enpVT5+pCQYMGDCg44n0Nf2m/q3+VP/t7+sP9b/6v/q7/n3/4rS+pv/Vf9d/63/1N/2p/t/i1Pr/GgBwYQCAEQBGARgFYBTAqEATAEYBGAVgFICpAEa1HjAYp36pP6n/1l/U/+nB/u/6//B/AmD9AgCMADAKwCgAowCMAlACQOkDkGb8B/11/R+ADxYgAKMAjAIwCgCg+gE4d8/6b/qf/aP+/v4TALx/AYARAEb5ASBqf0r/Ug82wKk/6f8F4K8BGBVgVIApAEb1ACDqL+hv6/+n/3/f+kMAjAIwCmAqAEB/T/9B/77/GsBfA2AVgFEARgGYCgDQ39A/0R9f/1z/vA9GgCMAjAIwCgDQD4D+g/6U/lf/Tf+u/7d/1f/v/2wEYBSAUQAWADgZgEG3/sZ/0t/S/2f/5H0wAjAKwCgAo0D/AAB+/0y/Tf+g/03/hP+v/7f/1h/S//t/AwEYBWAUgFEAugYA0J/S/+w/6n/3T/1P/y9/r/+3/3v/1f4fAowCMArAKACtAwB02f+z/9L/7n/3v+l/9/8GgFEARgEYBWApAKD/pv/t/+X/7t/1H/pf/e/9fwswCsAowLgCALSv+5/9/8k/6a/pv/ef/H8BwG8EYBTAcQWA/pX+0/6U/k1/T/9R/5f/pv/b/x4ARgEYBWC8LgCA0/+d/sv/tf+p/9//HQBGAZgKYCSA+XUBAKMAjAIwCkAXAFgGYBTAqQDAUgCuAuA/AjAKwCgAowBMBcBVAC4A0H0AowCMAlACQCkApQCkAjAKwCgAowBMBADtUwDOAnAKwCgAowCMAjAKwChAgwYMGDD4sfgF8G5/d3LdYpAAAAAASUVORK5CYII=" alt="Pearl 2025 Logo" width={40} height={40} className="rounded-md" />
      <span>Pearl 2025</span>
    </Link>
  );
}
