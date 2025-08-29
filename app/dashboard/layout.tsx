'use client'

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: CreditCard },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Expenses', href: '/dashboard/expenses', icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const getData = async () => {
      let admin = await localStorage.getItem('admin')
      if(!admin){
        router.push('/login')
      }
    }
    getData()
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    localStorage.removeItem('admin')
    toast({
      title: 'Signed out successfully',
      description: 'You have been signed out successfully',
    })
    router.push('/');
  };

  return (
    <div>
      <div className="lg:hidden fixed inset-y-0 z-50">
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  <span className="font-semibold">Mess ON</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-1 p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 border-r">
          <div className="flex h-16 items-center gap-2">
            <UtensilsCrossed className="h-6 w-6 text-primary" />
            <span className="font-semibold">Mess ON</span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                          pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main className="lg:pl-64">
        <div className="px-4 py-10 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}