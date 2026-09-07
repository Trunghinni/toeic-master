'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import type { UserDto } from '@toeic-master/shared-types';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await authApi.login({ email, password });

    if (result.success) {
      setAuth(result.data.user as UserDto, result.data.accessToken);
      const user = result.data.user as UserDto;
      if (!user.profile || !user.profile.targetScore) {
        router.push('/onboarding');
      } else {
        router.push('/roadmap');
      }
    } else {
      setErrorMessage(result.error.message || 'Email hoặc mật khẩu không chính xác.');
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('test@test.com');
    setPassword('Test1234!');
    setErrorMessage(null);
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-md border border-pink-200/80 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative top glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-rose-400/40 to-indigo-400/40 blur-xl rounded-full" />

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#3F3355] tracking-tight">Chào mừng bạn trở lại! 🌸</h1>
        <p className="text-sm text-[#8B7E9C] mt-1 font-medium">Đăng nhập để tiếp tục hành trình nâng band điểm</p>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-600 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1.5 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 ml-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355]">
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => alert('Tính năng Forgot Password sẽ gửi mã xác nhận qua email.')}
              className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7E9C] hover:text-[#3F3355] transition-colors"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            <>
              Đăng nhập ngay
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Fill */}
      <div className="mt-6 pt-5 border-t border-pink-100 flex items-center justify-between">
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 text-xs text-[#8B7E9C] hover:text-rose-500 font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Điền nhanh tài khoản test</span>
        </button>

        <p className="text-xs text-[#8B7E9C]">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
