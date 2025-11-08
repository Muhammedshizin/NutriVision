'use server';

import { analyzeFoodAndProvideNutrition } from '@/ai/flows/analyze-food-nutrition';
import type { AnalyzeFoodAndProvideNutritionOutput } from '@/ai/flows/analyze-food-nutrition';
import { providePersonalizedDietFeedback } from '@/ai/flows/personalized-diet-feedback';
import type { PersonalizedDietFeedbackInput } from '@/ai/flows/personalized-diet-feedback';
import { recommendHealthierAlternatives } from '@/ai/flows/healthier-alternatives';
import type { HealthierAlternativesInput } from '@/ai/flows/healthier-alternatives';
import { revalidatePath } from 'next/cache';

export async function getNutritionData(
  photoDataUri: string
): Promise<AnalyzeFoodAndProvideNutritionOutput | { error: string }> {
  if (!photoDataUri) {
    return { error: 'Image data is missing.' };
  }

  try {
    const result = await analyzeFoodAndProvideNutrition({ photoDataUri });
    return result;
  } catch (error) {
    console.error('Error in getNutritionData:', error);
    return { error: 'Failed to analyze food nutrition. Please try again.' };
  }
}

export async function getDietFeedback(
  input: PersonalizedDietFeedbackInput
): Promise<{ feedback: string } | { error: string }> {
  try {
    const result = await providePersonalizedDietFeedback(input);
    return result;
  } catch (error) {
    console.error('Error in getDietFeedback:', error);
    return { error: 'Failed to generate diet feedback. Please try again.' };
  }
}

export async function getHealthierAlternatives(
  input: HealthierAlternativesInput
): Promise<{ recommendations: string } | { error: string }> {
  try {
    const result = await recommendHealthierAlternatives(input);
    revalidatePath('/dashboard');
    return result;
  } catch (error) {
    console.error('Error in getHealthierAlternatives:', error);
    return { error: 'Failed to generate recommendations. Please try again.' };
  }
}
