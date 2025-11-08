
'use client';
import { AppLayout } from '@/components/AppLayout';
import { CalorieCalculator } from '@/components/calculator/CalorieCalculator';
import { useRequireAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function CalculatorPage() {
  const { user, loading } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppLayout>
      <CalorieCalculator />
    </AppLayout>
  );
}
