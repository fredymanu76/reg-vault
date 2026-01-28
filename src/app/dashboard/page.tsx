'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LoginPage from '@/components/auth/LoginPage';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for existing session
    const checkAuth = async () => {
      // In production, this would check Supabase session
      setLoading(false);
    };
    checkAuth();
  }, [setLoading]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-gold)]/30 border-t-[var(--color-gold)] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-text-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => {}} />;
  }

  return <DashboardLayout />;
}
