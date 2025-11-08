'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from './ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </TooltipProvider>
  );
}
