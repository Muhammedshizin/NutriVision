import { Leaf } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function Logo() {
  const { translations } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <Leaf className="h-7 w-7 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-foreground">
        {translations.logoTitle}
      </h1>
    </div>
  );
}
