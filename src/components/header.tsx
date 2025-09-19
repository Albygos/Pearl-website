'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from './logo';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Shield,
  Users,
  Star,
  BarChart,
  Home,
  ImageIcon,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/dashboard', label: 'My Dashboard' },
];

const adminNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/units', label: 'Manage Units', icon: Users },
  { href: '/admin/scores', label: 'Manage Scores', icon: Star },
  { href: '/admin/gallery', label: 'Manage Gallery', icon: ImageIcon },
  { href: '/admin/performance', label: 'Performance', icon: BarChart },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname.startsWith('/admin');
  const [isUnitLoggedIn, setIsUnitLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsUnitLoggedIn(!!localStorage.getItem('artfestlive_unit_id'));
    }
     const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, [pathname]);

  const handleUnitSignOut = () => {
    localStorage.removeItem('artfestlive_unit_id');
    setIsUnitLoggedIn(false);
    router.push('/login');
  };

  const handleAdminSignOut = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };


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
          {isAdminPage ? (
             isAdminLoggedIn && (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    Admin Menu
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Admin Navigation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {adminNavLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>
                        <link.icon className="mr-2 h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                   <DropdownMenuSeparator />
                   <DropdownMenuItem asChild>
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Back to Site</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAdminSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          ) : isUnitLoggedIn ? (
            <Button variant="outline" onClick={handleUnitSignOut}>
              Sign Out
            </Button>
          ) : (
             pathname !== '/login' && !pathname.startsWith('/admin') && (
              <Button asChild>
                <Link href="/login">Unit Sign In</Link>
              </Button>
            )
          )}
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 pt-8">
                  <nav className="flex flex-col gap-4">
                    {isAdminPage ? (
                      <>
                        <p className="text-sm font-medium text-muted-foreground px-2">Site</p>
                         {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              'text-lg font-medium flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary text-muted-foreground'
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                        <hr />
                        {isAdminLoggedIn && (
                          <>
                          <p className="text-sm font-medium text-muted-foreground px-2 pt-2">Admin</p>
                          {adminNavLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                'text-lg font-medium flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-secondary',
                                pathname === link.href
                                  ? 'bg-secondary text-primary'
                                  : 'text-muted-foreground'
                              )}
                            >
                              <link.icon className="h-5 w-5" />
                              {link.label}
                            </Link>
                          ))}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                              'text-lg font-medium transition-colors hover:text-primary',
                              pathname === link.href
                                ? 'text-primary'
                                : 'text-muted-foreground'
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
