import type { Metadata } from "next";
import { Bungee, Inter } from 'next/font/google'
import "@/css/globals.css";
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import Providers  from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bungee',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "At First Bite Cookies",
  description: "Delicious cookies delivered to your door!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bungee.variable} antialiased`}>
        <Navbar />
          <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
