'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-pastel-gradient flex items-center justify-center p-4">
      {/* Decorative ambient pastel circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-100/30 blur-2xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-rose-400 to-indigo-400 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-rose-300/40">
              🌸
            </div>
            <span className="text-2xl font-black text-gradient-brand">TOEIC Master</span>
          </div>
          <p className="text-sm text-[#8B7E9C] font-medium">
            Luyện TOEIC cùng nhau — mỗi ngày một bước tiến 💕
          </p>
        </motion.div>

        {/* Page content with transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
