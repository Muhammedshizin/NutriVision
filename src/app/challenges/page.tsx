'use client';
import { AppLayout } from '@/components/AppLayout';
import { Challenges } from '@/components/challenges/Challenges';
import { useRequireAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function ChallengesPage() {
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
      <Challenges />
    </AppLayout>
  );
}
