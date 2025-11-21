import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "PCC_POLINES // WORKSHOP",
    template: "%s | Workshop PCC"
  },
  description: "Official Portal of Workshop Division UKM PCC Polines. Providing training in Software, Network, and Multimedia.",
  keywords: ["Workshop PCC", "UKM PCC", "Polines", "Training Basic", "PCC Class", "Web Development", "Network Engineering", "Multimedia Design", "Politeknik Negeri Semarang"],
  authors: [{ name: "Workshop Team" }],
  creator: "Workshop Division PCC",
  publisher: "Polytechnic Computer Club",
  icons: {
    icon: '/images/pcc.png',
    apple: '/images/pcc.png',
  },
  openGraph: {
    title: "PCC_POLINES // WORKSHOP",
    description: "Official Portal of Workshop Division UKM PCC Polines. Join our training programs.",
    siteName: "Workshop PCC",
    images: [
      {
        url: '/images/pcc.png',
        width: 800,
        height: 600,
        alt: 'Workshop PCC Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PCC_POLINES // WORKSHOP",
    description: "Official Portal of Workshop Division UKM PCC Polines.",
    images: ['/images/pcc.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#030712] text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
