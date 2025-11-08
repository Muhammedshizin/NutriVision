export type HealthGoal =
  | 'weight loss'
  | 'muscle gain'
  | 'balanced diet'
  | 'diabetes-friendly';

export const healthGoals: HealthGoal[] = [
  'weight loss',
  'muscle gain',
  'balanced diet',
  'diabetes-friendly',
];

export type NutritionInfo = {
  foodItems: string[];
  estimatedPortionSizes: string[];
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
};

export type FoodAnalysis = {
  id: string;
  date: string;
  imageDataUri: string;
  healthGoal: HealthGoal;
  nutritionInfo: NutritionInfo;
  feedback: string;
};
