'use client';
import { AppLayout } from '@/components/AppLayout';
import { RecipeGenerator } from '@/components/recipe/RecipeGenerator';
import { useRequireAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function RecipePage() {
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
      <RecipeGenerator />
    </AppLayout>
  );
}
