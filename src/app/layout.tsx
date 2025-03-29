'use client';
import { AuthProvider } from '@/lib';
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>July24Academy - Learn Math at Your Own Pace</title>
        <meta name="description" content="July24Academy uses adaptive learning technology to personalize your math education" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
