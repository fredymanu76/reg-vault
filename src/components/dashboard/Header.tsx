'use client';

import { useState } from 'react';
import { useAuthStore, useUIStore } from '@/lib/store';
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, organisation, logout } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Application Review Required',
      message: 'SPI application #RV-2024-001 needs your review',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      title: 'FCA Query Received',
      message: 'New query on EMI application #RV-2024-002',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'Policy Generated',
      message: 'AML Policy v2 is ready for review',
      time: '3 hours ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-[rgba(10,10,10,0.9)] backdrop-blur-[20px] border-b border-[var(--color-border)] z-30 transition-all duration-300 flex items-center justify-between px-6',
        sidebarOpen ? 'left-64' : 'left-20'
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search applications, policies, regulations..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold)] focus:shadow-[var(--shadow-glow)] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-deep-black)] border border-[var(--color-border)] rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs text-[var(--color-text-muted)]">Connected</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] hover:bg-[var(--color-surface)] rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-xs font-bold bg-[var(--color-gold)] text-black rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--glass-bg-elevated)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-xl shadow-[var(--shadow-xl)] z-50 overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)]">
                  <h3 className="font-semibold text-[var(--color-text)]">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors cursor-pointer',
                        !notification.read && 'bg-[var(--color-gold)]/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {!notification.read && (
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-gold)]" />
                        )}
                        <div className={cn(!notification.read ? '' : 'ml-5')}>
                          <p className="text-sm font-medium text-[var(--color-text)]">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[var(--color-border)]">
                  <button className="w-full text-center text-sm text-[var(--color-gold)] hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 hover:bg-[var(--color-surface)] rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center">
              <span className="text-[var(--color-gold)] font-semibold text-sm">
                {user?.display_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text)]">
                {user?.display_name || 'User'}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {organisation?.name || 'Organisation'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--glass-bg-elevated)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-xl shadow-[var(--shadow-xl)] z-50 overflow-hidden">
                <div className="p-4 border-b border-[var(--color-border)]">
                  <p className="font-medium text-[var(--color-text)]">
                    {user?.display_name}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {user?.email}
                  </p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] rounded-lg transition-colors">
                    <Shield className="w-4 h-4" />
                    Security
                  </button>
                </div>
                <div className="p-2 border-t border-[var(--color-border)]">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
