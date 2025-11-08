
'use client';

import { useState, useMemo } from 'react';
import foodData from '@/lib/food-data.json';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface FoodItem {
  name: string;
  calories: number;
}

interface CartItem extends FoodItem {
  id: string;
}

export function CalorieCalculator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useLocalStorage<CartItem[]>('calorie-cart', []);
  const { translations } = useLanguage();

  const filteredFoods = useMemo(() => {
    if (!searchTerm) return [];
    return foodData.foods.filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [searchTerm]);

  const addToCart = (food: FoodItem) => {
    const newItem: CartItem = {
      ...food,
      id: `${food.name}-${Date.now()}`,
    };
    setCart([...cart, newItem]);
    setSearchTerm('');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  
  const clearCart = () => {
    setCart([]);
  }

  const totalCalories = useMemo(() => {
    return cart.reduce((total, item) => total + item.calories, 0);
  }, [cart]);

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
       <div className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
          {translations.calculatorTitle}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {translations.calculatorSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add Food Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                placeholder="Search for a food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredFoods.length > 0 && (
                <Card className="absolute z-10 w-full mt-2">
                  <CardContent className="p-2">
                    <ul className="space-y-1">
                      {filteredFoods.map((food) => (
                        <li key={food.name}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => addToCart(food)}
                          >
                            <span className="flex-1 text-left">{food.name}</span>
                            <span className="text-sm text-muted-foreground">{food.calories} kcal</span>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle>Meal Cart</CardTitle>
            {cart.length > 0 && (
               <Button variant="destructive" size="sm" onClick={clearCart}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60">
              {cart.length > 0 ? (
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                      <span>{item.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{item.calories} kcal</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                          <X className="h-4 w-4 text-destructive"/>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <p>Your cart is empty.</p>
                  <p className="text-sm">Search for items to add them.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          {cart.length > 0 && (
            <CardFooter className="flex justify-between items-center bg-muted/50 p-4 mt-4 rounded-b-lg">
                <span className="font-bold text-lg">Total Calories:</span>
                <span className="font-bold text-lg text-primary">{totalCalories.toFixed(0)} kcal</span>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
