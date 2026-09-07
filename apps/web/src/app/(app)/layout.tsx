'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, BookOpen, Flame, User, LogOut, Award, Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api-client';
import type { UserDto } from '@toeic-master/shared-types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isHydrated, setAuth, clearAuth, setHydrated } = useAuthStore();

  // Try to restore user session on initial load via /v1/auth/me
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const res = await authApi.me();
        if (res.success && isMounted) {
          const u = res.data as UserDto;
          setAuth(u, '');
        }
      } catch {
        // Not authenticated
      } finally {
        if (isMounted) {
          setHydrated();
        }
      }
    }

    if (!isHydrated) {
      checkSession();
    }

    return () => {
      isMounted = false;
    };
  }, [isHydrated, setAuth, setHydrated]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
    clearAuth();
    router.push('/login');
  };

  const navLinks = [
    { href: '/roadmap', label: 'Lộ trình học', icon: Compass },
    { href: '/placement-test', label: 'Test xếp lớp', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-pastel-gradient flex flex-col selection:bg-pink-200 selection:text-rose-900 text-[#3F3355]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full glass border-b border-pink-200/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link href="/roadmap" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center text-white text-lg shadow-sm shadow-rose-300/40 transition-transform group-hover:scale-105">
                🌸
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-gradient-brand leading-none">
                  TOEIC Master
                </span>
                <span className="text-[10px] text-[#8B7E9C] font-semibold tracking-wider uppercase mt-0.5">
                  Luyện thi cùng nhau 💕
                </span>
              </div>
            </Link>

            {/* Navigation items */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-rose-100/70 text-rose-600 shadow-xs'
                        : 'text-[#8B7E9C] hover:text-[#3F3355] hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-[#8B7E9C]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Controls & Stats */}
          <div className="flex items-center gap-3">
            {/* Streak Indicator */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-500 text-xs font-bold shadow-xs">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
              <span>{user?.profile?.currentStreak ?? 1} ngày streak</span>
            </div>

            {/* Target Band badge */}
            {user?.profile?.targetBand && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-500 text-xs font-bold shadow-xs">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mục tiêu {user.profile.targetScore ?? 650}+</span>
              </div>
            )}

            {/* User Dropdown / Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-pink-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-200 to-indigo-200 border border-pink-300 flex items-center justify-center text-[#3F3355] font-bold text-xs shadow-xs">
                  {user?.profile?.displayName ? user.profile.displayName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-[#3F3355] leading-tight">
                    {user?.profile?.displayName || user?.username || 'Học viên'}
                  </span>
                  <span className="text-[10px] text-[#8B7E9C]">
                    {user?.email || ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Đăng xuất"
                className="p-2 rounded-xl text-[#8B7E9C] hover:text-rose-500 hover:bg-rose-50 transition-colors"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-pink-200/40 py-6 text-center text-xs text-[#8B7E9C]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 TOEIC Master. Hành trình chinh phục mục tiêu cùng nhau 🌹</span>
          <div className="flex items-center gap-4 text-[#8B7E9C]">
            <span>Phiên bản Rose + Indigo Pastel</span>
            <span>•</span>
            <Link href="/onboarding" className="hover:text-rose-500 transition-colors font-semibold">
              Thiết lập lại mục tiêu
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
