'use client';
import { useEffect } from 'react';
import { AsideAdminComponent } from '../_data/components/Aside';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      localStorage.removeItem('tokenAdmin');
      localStorage.removeItem('tokenClient');
      window.location.replace('/sign-in');
    }
  }, []);
  return (
    <>
      <AsideAdminComponent />
      <main className="pl-16 min-h-screen">{children}</main>
    </>
  );
}
