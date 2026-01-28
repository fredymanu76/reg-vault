'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useUIStore, useAuthStore, useApplicationStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  FileCheck,
  GitBranch,
  Package,
  Mail,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shield,
  BookOpen,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'intake', label: 'Client Intake', icon: Users },
  { id: 'policies', label: 'Policies', icon: FileCheck },
  { id: 'diagrams', label: 'Diagrams', icon: GitBranch },
  { id: 'bundle', label: 'Bundle Pack', icon: Package },
  { id: 'correspondence', label: 'FCA Correspondence', icon: Mail },
];

const secondaryNavItems: NavItem[] = [
  { id: 'rkb', label: 'Knowledge Base', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeModule, setActiveModule } = useUIStore();
  const { user, organisation } = useAuthStore();
  const { applications } = useApplicationStore();

  const pendingApps = applications.filter(
    (app) => app.status === 'review_pending' || app.status === 'fca_queries'
  ).length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-[rgba(10,10,10,0.95)] backdrop-blur-[20px] border-r border-[var(--color-border)] transition-all duration-300 z-40 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="REG-VAULT"
            width={40}
            height={40}
            className="flex-shrink-0"
          />
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-white tracking-tight">
                REG-<span className="text-[var(--color-gold)]">VAULT</span>
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {organisation?.name || 'FCA Authorisation'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Application Button */}
      <div className="p-4">
        <button
          onClick={() => setActiveModule('new-application')}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all',
            'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)] text-black',
            'hover:shadow-[var(--shadow-glow-strong)]',
            !sidebarOpen && 'px-0'
          )}
        >
          <Plus className="w-5 h-5" />
          {sidebarOpen && <span>New Application</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeModule === item.id}
              isCollapsed={!sidebarOpen}
              onClick={() => setActiveModule(item.id)}
              badge={item.id === 'applications' ? pendingApps : undefined}
            />
          ))}
        </div>

        <div className="my-4 border-t border-[var(--color-border)]" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeModule === item.id}
              isCollapsed={!sidebarOpen}
              onClick={() => setActiveModule(item.id)}
            />
          ))}
        </div>
      </nav>

      {/* User Section */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
              <span className="text-[var(--color-gold)] font-semibold">
                {user.display_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user.display_name}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] capitalize">
                {user.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  badge?: number;
}

function NavButton({ item, isActive, isCollapsed, onClick, badge }: NavButtonProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
        isActive
          ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
          : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-surface)]',
        isCollapsed && 'justify-center px-0'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--color-gold)] rounded-r-full shadow-[0_0_10px_var(--color-gold)]" />
      )}

      <Icon
        className={cn(
          'w-5 h-5 flex-shrink-0',
          isActive && 'text-[var(--color-gold)]'
        )}
      />

      {!isCollapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
          {badge && badge > 0 && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--color-gold)] text-black rounded-full">
              {badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-sm text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {item.label}
        </div>
      )}
    </button>
  );
}
