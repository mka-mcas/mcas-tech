import '@/styles/globals.css';
import React from 'react';
import Navigation from '@/components/Navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCAS | Motorcycle Safety Research Platform',
  description: 'Malaysian Motorcycle Accident Statistics & Risk Intelligence Platform. Data-driven insights from PDRM to reduce motorcycle fatalities in Malaysia.',
  keywords: ['motorcycle safety malaysia', 'pdrm accident statistics', 'rider risk intelligence', 'mcas', 'road safety education'],
  authors: [{ name: 'MCAS Team' }],
  openGraph: {
    title: 'MCAS Risk Intelligence — Motorcycle Fatality Data Malaysia',
    description: 'Interactive dashboard using official PDRM 2022 statistics to help Malaysian riders understand and reduce risks.',
    images: [{ url: '/og-image.jpg' }], // Add an image later
    locale: 'en_MY',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        style={{ 
          margin: 0, 
          fontFamily: 'sans-serif', 
          backgroundColor: '#090d16', 
          color: '#f8fafc' 
        }}
      >
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}