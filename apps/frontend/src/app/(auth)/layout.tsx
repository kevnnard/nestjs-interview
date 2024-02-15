import { Suspense } from 'react';
import LoadingAuth from './loading';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {/* LOGO AUTH COMPONENT GOES HERE */}

      {/* FORM COMPONENT GOES HERE SIGN-IN AND SIGN-UP */}
      <Suspense fallback={<LoadingAuth />}>{children}</Suspense>
      {/* FOOTER AUTH COMPONENT GOES HERE */}
    </main>
  );
}
