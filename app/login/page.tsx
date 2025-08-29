'use client'

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {

  const router = useRouter();
  useEffect(() => {
    (async () => {
      let admin = await localStorage.getItem('admin')
      if(!admin){
        router.push('/login')
      }
    })()
  }, [])

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const { toast } = useToast();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: any) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(emailRegex.test(value));
  };

  const handlePasswordChange = (e: any) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(value.length >= 6);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    if (!emailValid || !passwordValid) {
      toast({
        variant: 'destructive',
        title: 'Invalid Credentials',
        description: 'Please enter a valid email and password.',
      });
      setLoading(false);
      return;
    }

    try {
      if(email == 'admin@gmail.com' && password == 'Admin@1234'){
        localStorage.setItem('admin', JSON.stringify({
          email,
          name: 'Khomi',
          lastLogin: new Date()
        }))
        router.push('/dashboard');
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to login',
          description: "Email and password is incorrect",
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {email && (
              <p className={`text-sm ${emailValid ? 'text-green-600' : 'text-red-600'}`}>
                {emailValid ? 'Valid email' : 'Invalid email format'}
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
          <Button type="submit" className="w-full" disabled={loading || !emailValid || !passwordValid} style={(!emailValid || !passwordValid) ? {
            backgroundColor: loading ? 'gray' : 'green'
          } : {}}>
            {loading ? (
              <Spinner size={20}/>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Card>
    </main>
  );
}
