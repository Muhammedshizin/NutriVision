'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a weekly meal plan.
 *
 * - generateWeeklyPlan - A function that creates a 7-day meal plan based on a health goal.
 * - GenerateWeeklyPlanInput - The input type for the generateWeeklyPlan function.
 * - GenerateWeeklyPlanOutput - The return type for the generateWeeklyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWeeklyPlanInputSchema = z.object({
  healthGoal: z
    .string()
    .describe(
      'The user\'s health goal, such as weight loss, muscle gain, balanced diet, or diabetes-friendly eating.'
    ),
});
export type GenerateWeeklyPlanInput = z.infer<
  typeof GenerateWeeklyPlanInputSchema
>;

const MealSchema = z.object({
    breakfast: z.string().describe('Suggestion for breakfast.'),
    lunch: z.string().describe('Suggestion for lunch.'),
    dinner: z.string().describe('Suggestion for dinner.'),
});

const GenerateWeeklyPlanOutputSchema = z.object({
    monday: MealSchema,
    tuesday: MealSchema,
    wednesday: MealSchema,
    thursday: MealSchema,
    friday: MealSchema,
    saturday: MealSchema,
    sunday: MealSchema,
});
export type GenerateWeeklyPlanOutput = z.infer<
  typeof GenerateWeeklyPlanOutputSchema
>;

export async function generateWeeklyPlan(
  input: GenerateWeeklyPlanInput
): Promise<GenerateWeeklyPlanOutput> {
  return generateWeeklyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyPlanPrompt',
  input: {schema: GenerateWeeklyPlanInputSchema},
  output: {schema: GenerateWeeklyPlanOutputSchema},
  prompt: `You are a helpful nutrition assistant. Create a simple 7-day meal plan for the user based on their health goal.

  Health Goal: {{healthGoal}}

  For each day of the week (monday to sunday), provide simple, healthy, and distinct suggestions for breakfast, lunch, and dinner. Do not include snacks. Keep the meal descriptions brief.
  `,
});

const generateWeeklyPlanFlow = ai.defineFlow(
  {
    name: 'generateWeeklyPlanFlow',
    inputSchema: GenerateWeeklyPlanInputSchema,
    outputSchema: GenerateWeeklyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
