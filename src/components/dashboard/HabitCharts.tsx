'use client';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { FoodAnalysis } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import { format, subDays, parseISO } from 'date-fns';

const COLORS = ['#FF8042', '#0088FE', '#00C49F']; // Orange for Fat, Blue for Carbs, Green for Protein

export function HabitCharts() {
  const [history] = useLocalStorage<FoodAnalysis[]>('food-analysis-history', []);

  const last7DaysData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    const data = last7Days.map(day => {
      const dayString = format(day, 'yyyy-MM-dd');
      const meals = history.filter(item => format(parseISO(item.date), 'yyyy-MM-dd') === dayString);
      const totalCalories = meals.reduce((acc, meal) => acc + meal.nutritionInfo.calories, 0);
      return {
        date: format(day, 'MMM d'),
        calories: totalCalories,
      };
    });
    return data;
  }, [history]);
  
  const macroData = useMemo(() => {
    if (history.length === 0) return [];
    const totals = history.reduce((acc, item) => {
        acc.protein += item.nutritionInfo.protein;
        acc.fat += item.nutritionInfo.fat;
        acc.carbs += item.nutritionInfo.carbohydrates;
        return acc;
    }, { protein: 0, fat: 0, carbs: 0 });

    const totalMacros = totals.protein + totals.fat + totals.carbs;
    if (totalMacros === 0) return [];

    return [
      { name: 'Protein', value: totals.protein },
      { name: 'Fat', value: totals.fat },
      { name: 'Carbs', value: totals.carbs },
    ];
  }, [history]);


  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Not Enough Data</h3>
        <p className="text-muted-foreground text-sm">Analyze some meals to see your habits here.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Calories (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData}>
              <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} kcal`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Average Macronutrient Split
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                 contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
