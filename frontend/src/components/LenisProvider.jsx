'use client';

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

export default function LenisProvider({ children }) {
  const pathname = usePathname();

  // Disable smooth scrolling for the office dashboard/ERP pages
  if (pathname?.startsWith('/office')) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
