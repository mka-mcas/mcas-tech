import '@/styles/globals.css';
import React from 'react';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'MCAS Dashboard',
  description: 'Motorcycle Safety Research Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#090d16', color: '#f8fafc' }}>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}