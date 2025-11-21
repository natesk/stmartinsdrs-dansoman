import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/context/FirebaseProvider';
import { cn } from '@/lib/utils';
import ClientAppProvider from '@/context/ClientAppProvider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
});

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
    <html lang="en">
      <body className={cn(ptSans.className, "bg-gray-100 dark:bg-gray-900")}>
        <FirebaseProvider>
          <ClientAppProvider>
            {children}
            <Toaster />
          </ClientAppProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
