'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import {
  Shield,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Lock,
  Zap,
  Building2,
  Scale,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Client Intake',
      description: 'Adaptive FCA-style questionnaire with risk-rated fit & proper assessment',
    },
    {
      icon: Scale,
      title: 'Licence Detection',
      description: 'Automated determination of correct FCA licence category and permissions',
    },
    {
      icon: Shield,
      title: 'Policy Factory',
      description: 'AI-generated policies mapped to FCA regulations with full traceability',
    },
    {
      icon: BarChart3,
      title: 'Business Planning',
      description: 'FCA-grade business plans with 3-5 year financial projections',
    },
    {
      icon: Building2,
      title: 'Bundle Builder',
      description: 'Complete FCA submission bundle with field-by-field form answers',
    },
    {
      icon: Users,
      title: 'Caseworker Support',
      description: 'AI-assisted FCA correspondence with human verification',
    },
  ];

  const licenceTypes = [
    { name: 'SPI', fullName: 'Small Payment Institution', phase: 'Phase 1' },
    { name: 'Small EMI', fullName: 'Small Electronic Money Institution', phase: 'Phase 1' },
    { name: 'API', fullName: 'Authorised Payment Institution', phase: 'Phase 2' },
    { name: 'EMI', fullName: 'Electronic Money Institution', phase: 'Phase 2' },
    { name: 'Open Banking', fullName: 'AIS / PISP / RAISP', phase: 'Phase 2' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-[20px] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="REG-VAULT"
              width={36}
              height={36}
            />
            <span className="font-bold text-lg">
              <span className="text-white">REG-</span>
              <span className="text-[var(--color-gold)]">VAULT</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            {mounted && isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-black font-semibold rounded-lg hover:shadow-[var(--shadow-glow)] transition-all"
              >
                Dashboard
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-black font-semibold rounded-lg hover:shadow-[var(--shadow-glow)] transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Logo */}
          <div
            className="mb-8 inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`relative transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}>
              <Image
                src="/images/logo.png"
                alt="REG-VAULT"
                width={180}
                height={180}
                className="mx-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-white">REG-</span>
            <span className="text-[var(--color-gold)] text-glow">VAULT</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] mb-4 max-w-3xl mx-auto">
            AI-Driven FCA Authorisation Platform
          </p>
          <p className="text-lg text-[var(--color-text-muted)] mb-12 max-w-2xl mx-auto">
            Not advice. Not templates. A verifiable regulatory production system.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-black rounded-lg hover:shadow-[var(--shadow-glow-strong)] transition-all group"
            >
              Start Application
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold border border-[var(--color-gold)] text-[var(--color-gold)] rounded-lg hover:bg-[rgba(212,175,55,0.1)] transition-all"
            >
              <Lock className="w-5 h-5" />
              Sign In
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-gold)]" />
              Human Verified
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-gold)]" />
              Full Auditability
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[var(--color-gold)]" />
              Regulatory Traceability
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[var(--color-gold)] rounded-full p-1">
            <div className="w-1.5 h-2.5 bg-[var(--color-gold)] rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete FCA Application <span className="text-[var(--color-gold)]">Production System</span>
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              From unstructured founder input to submission-ready FCA bundle
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-xl hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-lg)] transition-all group"
              >
                {/* Gold accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-12 h-12 rounded-lg bg-[rgba(212,175,55,0.1)] flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[var(--color-gold)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[var(--color-text)]">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Licence Types Section */}
      <section className="py-24 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Supported <span className="text-[var(--color-gold)]">Licence Categories</span>
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Comprehensive coverage for UK payment and e-money authorisation
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {licenceTypes.map((licence, index) => (
              <div
                key={index}
                className="px-6 py-4 bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-xl flex items-center gap-4"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-[var(--color-gold)]">{licence.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{licence.fullName}</div>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-[rgba(212,175,55,0.15)] text-[var(--color-gold)] rounded-full uppercase">
                  {licence.phase}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 bg-[var(--glass-bg)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-2xl text-center overflow-hidden">
            {/* Gold accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)]" />

            <Zap className="w-12 h-12 text-[var(--color-gold)] mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-text)]">
              Ready to transform your FCA application process?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8 max-w-xl mx-auto">
              Join UK fintech founders who are using REG-VAULT to produce regulator-grade applications with confidence.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-black rounded-lg hover:shadow-[var(--shadow-glow-strong)] transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="REG-VAULT" width={32} height={32} />
            <span className="font-semibold text-[var(--color-text)]">REG-VAULT</span>
          </div>
          <p className="text-sm text-[var(--color-text-muted)]">
            A verifiable regulatory production system
          </p>
        </div>
      </footer>
    </div>
  );
}
