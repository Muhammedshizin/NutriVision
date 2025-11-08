'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { getWeeklyPlan } from '@/lib/actions';
import { healthGoals, type HealthGoal } from '@/lib/types';
import type { GenerateWeeklyPlanOutput } from '@/ai/flows/generate-weekly-plan';
import { CalendarCheck, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useLanguage } from '@/hooks/use-language';

const daysOfWeek: (keyof GenerateWeeklyPlanOutput)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function WeeklyPlanner() {
  const [healthGoal, setHealthGoal] = useState<HealthGoal>('balanced diet');
  const [plan, setPlan] = useState<GenerateWeeklyPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { translations } = useLanguage();

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPlan(null);
    const result = await getWeeklyPlan({ healthGoal });
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate plan',
        description: result.error,
      });
    } else {
      setPlan(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          {translations.plannerTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translations.plannerSubtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Your Goal & Generate</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto sm:flex-1">
            <Select
              value={healthGoal}
              onValueChange={(v) => setHealthGoal(v as HealthGoal)}
              disabled={isLoading}
            >
              <SelectTrigger id="health-goal">
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {healthGoals.map((goal) => (
                  <SelectItem key={goal} value={goal} className="capitalize">
                    {goal.charAt(0).toUpperCase() + goal.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Plan
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {plan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Your 7-Day Meal Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Day</TableHead>
                    <TableHead>Breakfast</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Dinner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daysOfWeek.map((day) => (
                    <TableRow key={day}>
                      <TableCell className="font-medium capitalize">
                        {day}
                      </TableCell>
                      <TableCell>{plan[day].breakfast}</TableCell>
                      <TableCell>{plan[day].lunch}</TableCell>
                      <TableCell>{plan[day].dinner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
