'use client';
import { AppLayout } from '@/components/AppLayout';
import { HabitCharts } from '@/components/dashboard/HabitCharts';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { useRequireAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function DashboardPage() {
  const { user, loading } = useRequireAuth();
  const { translations } = useLanguage();

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
            {translations.dashboardTitle}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {translations.dashboardSubtitle}
          </p>
        </div>
        <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin" />}>
          <HabitCharts />
        </Suspense>
        <Suspense fallback={<Loader2 className="mx-auto h-8 w-8 animate-spin" />}>
          <Recommendations />
        </Suspense>
      </div>
    </AppLayout>
  );
}
