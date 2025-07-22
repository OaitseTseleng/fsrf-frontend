import type { Metadata } from "next";
import { Bungee, Inter } from 'next/font/google'
import "@/css/globals.css";
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import Providers  from './providers';
import Script from 'next/script';

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
  title: "FSRF",
  description: "FINANCIAL SERVICES REGULATORY FRAMEWORKS PORTAL HACKATHON",
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
        <Script id="chatbase-widget" strategy="afterInteractive">
          {`
            (function(){
              if(!window.chatbase || window.chatbase("getState") !== "initialized"){
                window.chatbase = (...arguments) => {
                  if (!window.chatbase.q) { window.chatbase.q = [] }
                  window.chatbase.q.push(arguments)
                };
                window.chatbase = new Proxy(window.chatbase, {
                  get(target, prop) {
                    if (prop === "q") return target.q;
                    return (...args) => target(prop, ...args);
                  }
                });
              }
              const onLoad = function(){
                const script = document.createElement("script");
                script.src = "https://www.chatbase.co/embed.min.js";
                script.id = "MlMGPSMP_n4NHhWswKpKI"; // <-- your Chatbase ID
                script.domain = "www.chatbase.co";
                document.body.appendChild(script);
              };
              if(document.readyState === "complete") {
                onLoad();
              } else {
                window.addEventListener("load", onLoad);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
