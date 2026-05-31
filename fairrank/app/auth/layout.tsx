import React from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar isLoggedIn={false} />
      {children}
    </main>
  );
}
