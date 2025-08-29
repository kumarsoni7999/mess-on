'use client'

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { organizationLogin } from '@/hooks/api/organization';
import { KeyRound, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {

  const router = useRouter();
  useEffect(() => {
    (async () => {
      let admin = await localStorage.getItem('admin')
      if (!admin) {
        router.push('/login')
      }
    })()
  }, [])

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileValid, setMobileValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const { toast } = useToast();

  const mobileRegex = /^[0-9]{10}$/;

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setMobile(value);
    setMobileValid(mobileRegex.test(value));
  };

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(value.length >= 6);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!mobileValid || !passwordValid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Credentials',
        description: 'Please enter a valid mobile and password.',
      });
      setLoading(false);
      return;
    }

    try {
      const res = await organizationLogin(mobile, password)
      if (res?.data) {
        localStorage.setItem('admin', JSON.stringify(res?.data))
        router.push('/dashboard');
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to login',
          description: res?.message || "Mobile and password is incorrect",
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="9876543210"
              value={mobile}
              onChange={handleEmailChange}
              required
            />
            {mobile && (
              <p className={`text-sm ${mobileValid ? 'text-green-600' : 'text-red-600'}`}>
                {mobileValid ? 'Valid mobile' : 'Invalid mobile format'}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="*******"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {password && (
              <p className={`text-sm ${passwordValid ? 'text-green-600' : 'text-red-600'}`}>
                {passwordValid ? 'Strong password' : 'Password must be at least 6 characters'}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading || !mobileValid || !passwordValid} style={(!mobileValid || !passwordValid) ? {
            backgroundColor: loading ? 'gray' : 'green'
          } : {}}>
            {loading ? (
              <Spinner size={20} />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
