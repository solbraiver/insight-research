import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'マーケットインサイトリサーチAI',
  description: 'AIを活用した市場調査ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        {children}
      </body>
    </html>
  );
}
