// app/risk-intelligence/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Risk Intelligence | Motorcycle Fatality Risk — Malaysia | MCAS',
  description: '2022 PDRM official statistics on motorcycle accidents in Malaysia. Interactive charts, collision types, time-of-day risks, and safety insights.',
  keywords: ['motorcycle fatality risk', 'pdrm 2022', 'rider safety malaysia', 'terbabas', 'side swipe accident'],
};

export default function RiskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}