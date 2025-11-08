'use server';

/**
 * @fileOverview Analyzes a food photo and provides nutritional information.
 *
 * - analyzeFoodAndProvideNutrition - A function that analyzes a food photo and provides nutritional information.
 * - AnalyzeFoodAndProvideNutritionInput - The input type for the analyzeFoodAndProvideNutrition function.
 * - AnalyzeFoodAndProvideNutritionOutput - The return type for the analyzeFoodAndProvideNutrition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFoodAndProvideNutritionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
});
export type AnalyzeFoodAndProvideNutritionInput = z.infer<
  typeof AnalyzeFoodAndProvideNutritionInputSchema
>;

const AnalyzeFoodAndProvideNutritionOutputSchema = z.object({
  foodItems: z.array(z.string()).describe('List of food items identified in the image.'),
  estimatedPortionSizes: z
    .array(z.string())
    .describe('Estimated portion sizes for each food item.'),
  calories: z.number().describe('Total calories in the meal.'),
  protein: z.number().describe('Total protein in grams.'),
  fat: z.number().describe('Total fat in grams.'),
  carbohydrates: z.number().describe('Total carbohydrates in grams.'),
});
export type AnalyzeFoodAndProvideNutritionOutput = z.infer<
  typeof AnalyzeFoodAndProvideNutritionOutputSchema
>;

export async function analyzeFoodAndProvideNutrition(
  input: AnalyzeFoodAndProvideNutritionInput
): Promise<AnalyzeFoodAndProvideNutritionOutput> {
  return analyzeFoodAndProvideNutritionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFoodAndProvideNutritionPrompt',
  input: {schema: AnalyzeFoodAndProvideNutritionInputSchema},
  output: {schema: AnalyzeFoodAndProvideNutritionOutputSchema},
  prompt: `Analyze the nutritional content of the meal in the following photo.

Photo: {{media url=photoDataUri}}

Identify the food items, estimate portion sizes, and calculate the total calories, protein, fat, and carbohydrates.

Output the data in JSON format.`,
});

const analyzeFoodAndProvideNutritionFlow = ai.defineFlow(
  {
    name: 'analyzeFoodAndProvideNutritionFlow',
    inputSchema: AnalyzeFoodAndProvideNutritionInputSchema,
    outputSchema: AnalyzeFoodAndProvideNutritionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
