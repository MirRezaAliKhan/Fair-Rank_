import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FairRank - Beyond CGPA: Smarter, Fairer Placements',
  description: 'Replace traditional CGPA-based shortlisting with an adaptive, trust-aware scoring system that evaluates skills, projects, and real capability over raw grades.',
  keywords: ['placement', 'recruitment', 'scoring', 'jobs', 'evaluation'],
  authors: [{ name: 'FairRank Team' }],
  openGraph: {
    title: 'FairRank',
    description: 'Smarter, fairer placement evaluation',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
