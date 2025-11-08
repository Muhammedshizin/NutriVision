'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { getGeneratedRecipe } from '@/lib/actions';
import { healthGoals, type HealthGoal } from '@/lib/types';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { ChefHat, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function RecipeGenerator() {
  const [healthGoal, setHealthGoal] = useState<HealthGoal>('balanced diet');
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { translations } = useLanguage();

  const handleGenerateRecipe = async () => {
    setIsLoading(true);
    setRecipe(null);
    const result = await getGeneratedRecipe({ healthGoal, ingredients });
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate recipe',
        description: result.error,
      });
    } else {
      setRecipe(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          {translations.recipeGeneratorTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translations.recipeGeneratorSubtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a Recipe</CardTitle>
          <CardDescription>
            Select your health goal and optionally list some ingredients you have.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="health-goal">Health Goal</Label>
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
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (optional)</Label>
              <Input
                id="ingredients"
                placeholder="e.g., chicken, broccoli, rice"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <Button
            onClick={handleGenerateRecipe}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Recipe
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {recipe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              {recipe.recipeName}
            </CardTitle>
            <CardDescription>{recipe.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className='grid grid-cols-3 gap-4 text-center'>
                <div>
                    <p className='font-bold text-sm'>Prep Time</p>
                    <p className='text-muted-foreground text-sm'>{recipe.prepTime}</p>
                </div>
                 <div>
                    <p className='font-bold text-sm'>Cook Time</p>
                    <p className='text-muted-foreground text-sm'>{recipe.cookTime}</p>
                </div>
                 <div>
                    <p className='font-bold text-sm'>Servings</p>
                    <p className='text-muted-foreground text-sm'>{recipe.servings}</p>
                </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
