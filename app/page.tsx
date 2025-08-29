"use client"
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 text-center">
        <div className="flex justify-center">
          <UtensilsCrossed className="h-12 w-12 text-primary" />
        </div>
        <h1 className="logo-text">APNA Mess</h1>
        <p className="text-muted-foreground">
          Modern mess management system for tracking attendance, payments, and expenses
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
          <Button asChild className="w-full bg-black text-white border">
            <Link href="/user/login">User login</Link>
          </Button>
      </Card>
    </main>
  );
}