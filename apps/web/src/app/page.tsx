import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TOEIC Master — Luyện TOEIC 450–990 Điểm',
};

// ── Feature card data ────────────────────────────────────────
const features = [
  {
    icon: '🎯',
    title: 'Lộ trình cá nhân hóa',
    description:
      'Placement test → roadmap tuần, phân bổ từ vựng & ngữ pháp thông minh theo khoảng cách band.',
  },
  {
    icon: '🃏',
    title: 'Flashcard + SRS',
    description:
      'Thuật toán SM-2 lên lịch ôn tập tối ưu. Học từ vựng với ảnh, phát âm US/UK, 5 chế độ học.',
  },
  {
    icon: '📝',
    title: 'Ngân hàng đề thi',
    description:
      'Đề luyện từng Part và full test 120 phút giả lập. Chấm điểm quy đổi TOEIC chính xác.',
  },
  {
    icon: '🎤',
    title: 'AI chấm Speaking',
    description:
      'Ghi âm → AI đánh giá phát âm, độ trôi chảy, ngữ pháp. Waveform so sánh giọng mẫu.',
  },
  {
    icon: '✍️',
    title: 'AI chấm Writing',
    description:
      'LLM chấm theo rubric TOEIC Writing chính thức, trả điểm từng tiêu chí và gợi ý sửa lỗi.',
  },
  {
    icon: '👥',
    title: 'Học nhóm & Thách đấu',
    description:
      'Kết bạn, study group, leaderboard, thách đấu 1-1 realtime — duy trì động lực học dài hạn.',
  },
];

const stats = [
  { value: '990', label: 'Điểm tối đa TOEIC', suffix: '' },
  { value: '10K+', label: 'Từ vựng TOEIC', suffix: '' },
  { value: '200+', label: 'Đề luyện tập', suffix: '' },
  { value: '6', label: 'Band trình độ', suffix: '' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[hsl(220,25%,8%)] text-white overflow-hidden">
      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-gradient-brand">TOEIC</span>
              <span className="text-white"> Master</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <Link href="#features" className="hover:text-white transition-colors">
              Tính năng
            </Link>
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              Cách hoạt động
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">
              Bảng giá
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="btn-secondary text-sm py-2 px-4 text-white/80 border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              Đăng nhập
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(ellipse, hsl(220,75%,52%) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-60 right-0 w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background:
                'radial-gradient(ellipse, hsl(178,85%,38%) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            Nền tảng TOEIC thế hệ mới — AI-powered
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            Chinh phục{' '}
            <span className="text-gradient-brand">TOEIC 990</span>
            <br />
            bằng AI & Khoa học Học tập
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
            Lộ trình cá nhân hóa · Flashcard SRS · Ngân hàng đề thi · AI chấm Speaking &
            Writing · Học nhóm realtime
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/auth/register" className="btn-primary text-base py-4 px-8">
              🚀 Bắt đầu miễn phí — không cần thẻ
            </Link>
            <Link href="/placement-test" className="btn-secondary text-base py-4 px-8 border-white/10 text-white/80">
              📊 Kiểm tra trình độ ngay
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-6 text-sm text-white/40">
            Không cần cài đặt · Chạy ngay trên trình duyệt · Miễn phí vĩnh viễn cho gói cơ bản
          </p>
        </div>

        {/* ── Stats bar ──────────────────────────────────────── */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-5 text-center border border-white/5"
              >
                <div className="text-3xl font-extrabold text-gradient-brand">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Mọi thứ bạn cần để{' '}
              <span className="text-gradient-brand">đạt mục tiêu TOEIC</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Từ từ vựng đến kỹ năng nói — một nền tảng, đủ công cụ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover glass-dark p-6 rounded-2xl border border-white/5 group"
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce-soft inline-block">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">{feature.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(220,25%,6%)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            3 bước để bắt đầu
          </h2>
          <p className="text-white/50 mb-16">Từ đăng ký đến lộ trình cá nhân trong 5 phút.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Làm Placement Test',
                desc: '20–30 câu trộn ngữ pháp & đọc hiểu, hệ thống định band trình độ của bạn.',
              },
              {
                step: '02',
                title: 'Nhận Roadmap cá nhân',
                desc: 'Lộ trình tuần được tính theo khoảng cách band hiện tại → mục tiêu & deadline.',
              },
              {
                step: '03',
                title: 'Học & theo dõi tiến độ',
                desc: 'Dashboard radar chart, streak, XP. Hệ thống nhắc ôn flashcard đến hạn mỗi ngày.',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-black text-brand-800 mb-4">{item.step}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link href="/auth/register" className="btn-primary text-base py-4 px-10">
              Bắt đầu ngay — miễn phí
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold">
              <span className="text-gradient-brand">TOEIC</span>
              <span className="text-white"> Master</span>
            </span>
          </div>
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} TOEIC Master. Học thông minh hơn, đạt mục tiêu nhanh hơn.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              Bảo mật
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              Điều khoản
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
