'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { Button, Input } from '@/components/common';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  const { setUser, setOrganisation } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate authentication - replace with actual Supabase auth
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user for demo
      setUser({
        id: '1',
        email: email,
        display_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        role: 'client_admin',
        organisation_id: '1',
        is_active: true,
        mfa_enabled: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      setOrganisation({
        id: '1',
        name: 'Demo Organisation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      onLogin();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="REG-VAULT"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold">
            <span className="text-white">REG-</span>
            <span className="text-[var(--color-gold)]">VAULT</span>
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2">
            AI-Driven FCA Authorisation Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-2xl p-8 shadow-[var(--shadow-xl)] relative">
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-t-2xl" />

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {mode === 'login' && 'Welcome back'}
              {mode === 'register' && 'Create your account'}
              {mode === 'forgot' && 'Reset your password'}
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {mode === 'login' && 'Sign in to access your applications'}
              {mode === 'register' && 'Start your FCA application journey'}
              {mode === 'forgot' && "Enter your email to receive a reset link"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            {mode !== 'forgot' && (
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-[var(--color-gold)] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                required
              />
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[var(--color-text-muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[var(--color-gold)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' && (
              <p className="text-[var(--color-text-muted)]">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[var(--color-gold)] hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            )}
            {(mode === 'register' || mode === 'forgot') && (
              <p className="text-[var(--color-text-muted)]">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[var(--color-gold)] hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
          <Shield className="w-4 h-4 text-[var(--color-gold)]" />
          <span>Secured with bank-grade encryption</span>
        </div>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-lg">
          <p className="text-xs text-[var(--color-text-muted)] text-center">
            <strong className="text-[var(--color-gold)]">Demo:</strong> Enter any email and password to explore
          </p>
        </div>
      </div>
    </div>
  );
}
