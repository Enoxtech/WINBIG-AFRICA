import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'WINBIG AFRICA — Nigeria\'s Premier Lottery Platform',
  description: 'Win life-changing prizes! Enter lottery campaigns for as little as ₦100. ₦5,000,000 Mega Jackpot, cars, gadgets, and more. Nigeria\'s most trusted raffle platform.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
