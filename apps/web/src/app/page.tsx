import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TOEIC Master — Luyện TOEIC 450–990 Điểm Cùng Nhau',
};

// ── Feature card data ────────────────────────────────────────
const features = [
  {
    icon: '🎯',
    title: 'Lộ trình cá nhân hóa',
    description:
      'Placement test 100 câu → roadmap từng tuần, phân bổ từ vựng & ngữ pháp thông minh theo khoảng cách band.',
  },
  {
    icon: '🌸',
    title: 'Đồng hành cùng học (Couple Mode)',
    description:
      'Cùng theo dõi streak, chia sẻ mục tiêu số từ học trong tuần và thi đua nhẹ nhàng cùng người thương.',
  },
  {
    icon: '🃏',
    title: 'Flashcard 3D + SRS SM-2',
    description:
      'Thuật toán SM-2 lên lịch ôn tập tối ưu. Lật thẻ 3D mượt mà, phát âm US/UK chuẩn, 20 chủ đề thiết yếu.',
  },
  {
    icon: '📝',
    title: 'Ngân hàng đề thi TOEIC',
    description:
      'Đề luyện Part 1–7 và full test giả lập 120 phút. Hệ thống chấm và quy đổi điểm chuẩn theo bảng ETS.',
  },
  {
    icon: '🎙️',
    title: 'AI chấm Speaking',
    description:
      'Ghi âm trực tiếp, hiển thị waveform âm thanh, nhận diện phát âm và độ lưu loát chi tiết.',
  },
  {
    icon: '✍️',
    title: 'AI chấm Writing',
    description:
      'Chấm bài viết theo rubric chính thức, phân tích lỗi ngữ pháp và gợi ý diễn đạt tự nhiên hơn.',
  },
];

const stats = [
  { value: '990', label: 'Điểm tối đa TOEIC', suffix: '' },
  { value: '850+', label: 'Từ vựng cốt lõi', suffix: '' },
  { value: '20+', label: 'Chủ đề bài học', suffix: '' },
  { value: '6', label: 'Band trình độ', suffix: '' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pastel-gradient text-[#3F3355] selection:bg-pink-200 selection:text-rose-900 overflow-hidden">
      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-pink-200/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-400 to-indigo-400 flex items-center justify-center text-white text-lg shadow-sm shadow-rose-300/40 font-bold">
              🌸
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gradient-brand">
              TOEIC Master
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#8B7E9C]">
            <Link href="#features" className="hover:text-rose-500 transition-colors">
              Tính năng
            </Link>
            <Link href="#how-it-works" className="hover:text-rose-500 transition-colors">
              Cách hoạt động
            </Link>
            <Link href="/roadmap" className="hover:text-rose-500 transition-colors">
              Lộ trình
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-secondary text-sm py-2 px-4"
            >
              Đăng nhập
            </Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-4">
              Bắt đầu miễn phí
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-rose-200/40 blur-3xl" />
          <div className="absolute top-60 right-0 w-[400px] h-[400px] rounded-full bg-indigo-200/30 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-200 bg-white/80 text-rose-500 text-xs font-bold mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            Nền tảng TOEIC thế hệ mới — Phong cách Pastel & Cùng học 💕
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-[#3F3355] leading-tight">
            Chinh phục mục tiêu{' '}
            <span className="text-gradient-brand">TOEIC</span>
            <br />
            nhẹ nhàng & đầy cảm hứng
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-[#8B7E9C] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Lộ trình cá nhân hóa · Flashcard SRS lật 3D · 100 câu kiểm tra đầu vào · Đề thi đầy đủ 7 Part · Học nhóm đồng hành cùng người thương
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link href="/register" className="btn-primary text-base py-3.5 px-8 shadow-md">
              🌸 Bắt đầu học miễn phí
            </Link>
            <Link href="/placement-test" className="btn-secondary text-base py-3.5 px-8">
              📊 Làm bài test xếp lớp (15p)
            </Link>
          </div>

          <p className="mt-5 text-xs text-[#8B7E9C] font-medium">
            Không cần cài đặt phức tạp · Giao diện pastel dịu mắt · Đầy đủ tài liệu cần thiết
          </p>
        </div>

        {/* ── Stats bar ──────────────────────────────────────── */}
        <div className="relative max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-3xl p-5 text-center border border-pink-200/80 shadow-xs"
              >
                <div className="text-3xl font-black text-gradient-brand">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-xs font-bold text-[#8B7E9C] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-3 text-[#3F3355]">
              Mọi thứ bạn cần để{' '}
              <span className="text-gradient-brand">chinh phục band điểm</span>
            </h2>
            <p className="text-[#8B7E9C] max-w-xl mx-auto text-sm font-medium">
              Thiết kế tối ưu cho trải nghiệm học vui vẻ, ghi nhớ sâu và duy trì thói quen mỗi ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-3xl p-6 border border-pink-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3 inline-block">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-base mb-2 text-[#3F3355]">{feature.title}</h3>
                <p className="text-[#8B7E9C] text-xs leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-pink-200/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-3 text-[#3F3355]">
            3 bước để bắt đầu
          </h2>
          <p className="text-[#8B7E9C] mb-14 text-sm font-medium">
            Từ đăng ký đến lộ trình cá nhân hóa chỉ trong 5 phút.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Làm Placement Test',
                desc: '100 câu hỏi trắc nghiệm thông minh, hệ thống định vị band điểm chính xác của bạn.',
              },
              {
                step: '02',
                title: 'Nhận Roadmap cá nhân',
                desc: 'Lộ trình tuần được tính toán theo khoảng cách band hiện tại đến mục tiêu mong muốn.',
              },
              {
                step: '03',
                title: 'Học & Theo dõi tiến độ',
                desc: 'Học từ vựng flashcard 3D, làm bài tập ngữ pháp, duy trì streak cùng bạn bè.',
              },
            ].map((item) => (
              <div key={item.step} className="relative glass rounded-3xl p-6 border border-pink-200">
                <div className="text-5xl font-black text-rose-300/60 mb-2">{item.step}</div>
                <h3 className="font-bold text-base mb-1.5 text-[#3F3355]">{item.title}</h3>
                <p className="text-[#8B7E9C] text-xs font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <Link href="/register" className="btn-primary text-base py-3.5 px-10 shadow-md">
              Tham gia ngay hôm nay 💕
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-pink-200/60 py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#8B7E9C]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🌸</span>
            <span className="font-extrabold text-gradient-brand">
              TOEIC Master
            </span>
          </div>
          <p>
            © {new Date().getFullYear()} TOEIC Master. Đồng hành cùng bạn trên từng nấc thang điểm số.
          </p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-rose-500 transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="hover:text-rose-500 transition-colors">
              Đăng ký
            </Link>
            <Link href="/roadmap" className="hover:text-rose-500 transition-colors">
              Lộ trình
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
