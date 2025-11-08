'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import { FoodAnalysis } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

export function HistoryList() {
  const [history, setHistory] = useLocalStorage<FoodAnalysis[]>(
    'food-analysis-history',
    []
  );

  const handleDelete = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
  };
  
  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No History Found</h3>
        <p className="text-muted-foreground text-sm">Analyze a meal to start building your history.</p>
      </Card>
    );
  }


  return (
    <div className="space-y-4">
      {history.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.imageDataUri}
                  alt="Analyzed meal"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <CardTitle className="font-headline text-xl">
                  {item.nutritionInfo.foodItems.join(', ')}
                </CardTitle>
                <CardDescription>
                  {format(parseISO(item.date), 'MMMM d, yyyy - h:mm a')}
                </CardDescription>
                 <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {item.healthGoal}
                    </Badge>
                  </div>
              </div>
            </div>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this analysis entry from your history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(item.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger>View Details</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Nutrition</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Calories: {item.nutritionInfo.calories.toFixed(0)} kcal</li>
                      <li>Protein: {item.nutritionInfo.protein.toFixed(1)} g</li>
                      <li>Fat: {item.nutritionInfo.fat.toFixed(1)} g</li>
                      <li>Carbohydrates: {item.nutritionInfo.carbohydrates.toFixed(1)} g</li>
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-semibold text-sm mb-2">Identified Portions</h4>
                     <div className="flex flex-wrap gap-2">
                        {item.nutritionInfo.foodItems.map((food, i) => (
                          <Badge key={i} variant="secondary">
                            {food} ({item.nutritionInfo.estimatedPortionSizes[i]})
                          </Badge>
                        ))}
                      </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Feedback</h4>
                    <p className="text-sm text-muted-foreground">{item.feedback}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
