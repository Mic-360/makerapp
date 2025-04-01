import AuthProvider from '@/components/auth-provider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const grokRegular = localFont({
  src: './fonts/NHaasGroteskTXPro-55Rg.ttf',
  variable: '--font-grok-regular',
  display: 'swap',
  style: 'normal',
});

const grokItalic = localFont({
  src: './fonts/NHaasGroteskTXPro-56It.ttf',
  variable: '--font-grok-italic',
  display: 'swap',
  style: 'italic',
});

const grokMedium = localFont({
  src: './fonts/NHaasGroteskTXPro-65Md.ttf',
  variable: '--font-grok-medium',
  display: 'swap',
  style: 'normal',
});

const grokMediumItalic = localFont({
  src: './fonts/NHaasGroteskTXPro-66MdIt.ttf',
  variable: '--font-grok-medium-italic',
  display: 'swap',
  style: 'italic',
});

const grokBold = localFont({
  src: './fonts/NHaasGroteskTXPro-75Bd.ttf',
  variable: '--font-grok-bold',
  display: 'swap',
  style: 'normal',
});

const grokBoldItalic = localFont({
  src: './fonts/NHaasGroteskTXPro-76BdIt.ttf',
  variable: '--font-grok-bold-italic',
  display: 'swap',
  style: 'italic',
});

export const metadata: Metadata = {
  title: 'Karkhana MakerHub',
  description:
    'Karkhana MakerHub is a platform for makers to find and book machines, events and makerspaces.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body
        className={`${grokRegular.variable} ${grokItalic.variable} ${grokMedium.variable} ${grokMediumItalic.variable} ${grokBold.variable} ${grokBoldItalic.variable} font-sans antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
