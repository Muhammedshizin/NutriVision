'use client';

import { BarChart, Flame, Leaf, MinusCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const challenges = [
  {
    id: 'low-sugar',
    title: 'Low Sugar Week',
    description: 'Commit to consuming minimal added sugars for a full week.',
    icon: MinusCircle,
    duration: '7 days',
    category: 'Diet'
  },
  {
    id: 'protein-boost',
    title: 'Protein Boost Day',
    description: 'Ensure every meal today is rich in protein to support muscle growth.',
    icon: Flame,
    duration: '1 day',
    category: 'Fitness'
  },
  {
    id: 'mindful-eating',
    title: 'Mindful Eating Challenge',
    description: 'Pay full attention to your food, from preparation to consumption.',
    icon: Leaf,
    duration: '3 days',
    category: 'Wellness'
  },
  {
    id: 'hydration-hero',
    title: 'Hydration Hero',
    description: 'Drink at least 8 glasses of water throughout the day.',
    icon: ShieldCheck,
    duration: '1 day',
    category: 'Health'
  },
  {
    id: 'activity-streak',
    title: 'Activity Streak',
    description: 'Complete at least 30 minutes of physical activity every day for a week.',
    icon: BarChart,
    duration: '7 days',
    category: 'Fitness'
  },
];


export function Challenges() {
  const { translations } = useLanguage();

  return (
     <div className="container mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          {translations.challengesTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translations.challengesSubtitle}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <challenge.icon className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>{challenge.title}</CardTitle>
                    <div className='flex items-center gap-2 mt-1'>
                        <Badge variant="secondary">{challenge.duration}</Badge>
                         <Badge variant="outline">{challenge.category}</Badge>
                    </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription>{challenge.description}</CardDescription>
            </CardContent>
            <div className='p-6 pt-0'>
                <Button className="w-full">Join Challenge</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
