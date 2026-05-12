import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import MuiProvider from '@/components/MuiProvider';

const roboto = Roboto({ subsets: ['latin'], weight: ['300','400','500','700'] });

export const metadata: Metadata = {
  title: 'Admin Portal — Device Registry',
  description: 'Device Login Admin Portal — Manage registrations, users and logs.',
  icons: { icon: '/assets/angular.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
