'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserCheck, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth.store';
import type { UserDto } from '@toeic-master/shared-types';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMessage) setErrorMessage(null);
  };

  // Password rules validation
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasLetter = /[a-zA-Z]/.test(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinLength || !hasNumber || !hasLetter) {
      setErrorMessage('Mật khẩu cần ít nhất 8 ký tự, gồm cả chữ và số.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await authApi.register({
      email: formData.email.trim(),
      username: formData.username.trim().toLowerCase(),
      displayName: formData.displayName.trim(),
      password: formData.password,
    });

    if (result.success) {
      setAuth(result.data.user as UserDto, result.data.accessToken);
      router.push('/onboarding');
    } else {
      setErrorMessage(result.error.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-8 shadow-md border border-pink-200/80 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative top glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-r from-rose-400/40 to-indigo-400/40 blur-xl rounded-full" />

      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold text-[#3F3355] tracking-tight">Tạo tài khoản học tập 🌷</h1>
        <p className="text-sm text-[#8B7E9C] mt-1 font-medium">Bắt đầu kế hoạch nâng band điểm TOEIC mục tiêu</p>
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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1 ml-1">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
              <input
                type="text"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1 ml-1">
              Username
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="nguyenvana"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tenban@example.com"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1 ml-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Tối thiểu 8 ký tự (chữ & số)"
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B7E9C] hover:text-[#3F3355] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3F3355] mb-1 ml-1">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7E9C]" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-200 bg-white/90 focus:bg-white text-[#3F3355] placeholder:text-[#8B7E9C]/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all outline-none text-sm"
            />
          </div>
        </div>

        {/* Password hints */}
        {formData.password.length > 0 && (
          <div className="text-xs space-y-1 p-2.5 rounded-xl bg-pink-50/50 border border-pink-100">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-500' : 'text-[#8B7E9C]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ít nhất 8 ký tự</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber && hasLetter ? 'text-emerald-500' : 'text-[#8B7E9C]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bao gồm cả chữ cái và số</span>
            </div>
            {formData.confirmPassword.length > 0 && (
              <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-500' : 'text-rose-500'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mật khẩu khớp nhau</span>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            <>
              Đăng ký và Thiết lập mục tiêu
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-pink-100 text-center">
        <p className="text-xs text-[#8B7E9C]">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-bold text-rose-500 hover:text-rose-600 underline underline-offset-2">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
