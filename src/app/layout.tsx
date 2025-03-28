import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'July24Academy - Adaptive Math Learning',
  description: 'Learn mathematics at your own pace with personalized lessons and adaptive practice problems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
