import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/AppProvider';
import { FirebaseProvider } from '@/context/FirebaseProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShiftSync Pro',
  description: 'Medical Staff Scheduling App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <FirebaseProvider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
