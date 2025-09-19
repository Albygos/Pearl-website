'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu, Shield, Users, Star, BarChart, Home } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
];

const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Shield },
    { href: '/admin/scores', label: 'Manage Scores', icon: Star },
    { href: '/admin/units', label: 'Manage Units', icon: Users },
    { href: '/admin/performance', label: 'Performance', icon: BarChart },
];

export default function Header() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <Button asChild variant="ghost" className="hidden md:flex">
             <Link href="/admin">
               <Shield className="mr-2 h-4 w-4" />
               Admin Panel
             </Link>
           </Button>
           <Button asChild>
             <Link href="/login">Sign In</Link>
           </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle><Logo /></SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 pt-8">
                  <nav className="flex flex-col gap-4">
                  {isAdminPage ? (
                    <>
                      {adminNavLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'text-lg font-medium flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary',
                            pathname === link.href ? 'bg-secondary text-primary' : 'text-muted-foreground'
                          )}
                        >
                          <link.icon className="h-5 w-5" />
                          {link.label}
                        </Link>
                      ))}
                      <hr/>
                       <Link
                          href="/"
                          className={cn(
                            'text-lg font-medium flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary text-muted-foreground'
                          )}
                        >
                          <Home className="h-5 w-5" />
                          Back to Site
                        </Link>
                    </>
                  ) : (
                     <>
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            'text-lg font-medium transition-colors hover:text-primary',
                            pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                       <Button asChild variant="outline">
                         <Link href="/admin">
                           <Shield className="mr-2 h-4 w-4" />
                           Admin Panel
                         </Link>
                       </Button>
                    </>
                  )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
