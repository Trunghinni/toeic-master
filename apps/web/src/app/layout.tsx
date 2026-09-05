import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TOEIC Master — Luyện TOEIC Toàn Diện',
    template: '%s | TOEIC Master',
  },
  description:
    'Nền tảng học TOEIC toàn diện với flashcard AI, ngân hàng đề thi, luyện 4 kỹ năng, và lộ trình cá nhân hóa giúp bạn đạt 450–990 điểm.',
  keywords: ['TOEIC', 'luyện TOEIC', 'học tiếng Anh', 'flashcard', 'đề thi TOEIC'],
  authors: [{ name: 'TOEIC Master Team' }],
  creator: 'TOEIC Master',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://toeicmaster.vn',
    siteName: 'TOEIC Master',
    title: 'TOEIC Master — Luyện TOEIC Toàn Diện',
    description: 'Học TOEIC hiệu quả với AI, flashcard SRS, và lộ trình cá nhân hoá.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOEIC Master',
    description: 'Học TOEIC hiệu quả với AI, flashcard SRS, và lộ trình cá nhân hoá.',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
