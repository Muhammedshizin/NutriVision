'use server';

/**
 * @fileOverview A personalized diet feedback AI agent.
 *
 * - providePersonalizedDietFeedback - A function that handles the personalized diet feedback process.
 * - PersonalizedDietFeedbackInput - The input type for the providePersonalizedDietFeedback function.
 * - PersonalizedDietFeedbackOutput - The return type for the providePersonalizedDietFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDietFeedbackInputSchema = z.object({
  foodName: z.string().describe('The name of the food item.'),
  calories: z.number().describe('The number of calories in the food item.'),
  protein: z.number().describe('The amount of protein in grams in the food item.'),
  fat: z.number().describe('The amount of fat in grams in the food item.'),
  carbs: z.number().describe('The amount of carbohydrates in grams in the food item.'),
  healthGoal: z
    .enum(['weight loss', 'muscle gain', 'balanced diet', 'diabetes-friendly'])
    .describe('The user\u2019s health goal.'),
});
export type PersonalizedDietFeedbackInput = z.infer<typeof PersonalizedDietFeedbackInputSchema>;

const PersonalizedDietFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized diet feedback based on the analyzed food and health goals.'),
});
export type PersonalizedDietFeedbackOutput = z.infer<typeof PersonalizedDietFeedbackOutputSchema>;

export async function providePersonalizedDietFeedback(
  input: PersonalizedDietFeedbackInput
): Promise<PersonalizedDietFeedbackOutput> {
  return providePersonalizedDietFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedDietFeedbackPrompt',
  input: {schema: PersonalizedDietFeedbackInputSchema},
  output: {schema: PersonalizedDietFeedbackOutputSchema},
  prompt: `You are a registered dietitian providing personalized diet feedback.

  Based on the following nutritional information and the user's health goal, provide tailored advice and suggestions. The advice should be positive, encouraging, and actionable.

  Food: {{foodName}}
  Calories: {{calories}} kcal
  Protein: {{protein}} g
  Fat: {{fat}} g
  Carbs: {{carbs}} g
  Health Goal: {{healthGoal}}

  Provide specific feedback related to how this food aligns with or detracts from their goal. Also provide at least one actionable suggestion.
  `,
});

const providePersonalizedDietFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedDietFeedbackFlow',
    inputSchema: PersonalizedDietFeedbackInputSchema,
    outputSchema: PersonalizedDietFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
