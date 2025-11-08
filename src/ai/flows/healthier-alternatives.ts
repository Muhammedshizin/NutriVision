'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending healthier food alternatives.
 *
 * - recommendHealthierAlternatives - A function that recommends healthier food alternatives based on user habits and goals.
 * - HealthierAlternativesInput - The input type for the recommendHealthierAlternatives function.
 * - HealthierAlternativesOutput - The return type for the recommendHealthierAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthierAlternativesInputSchema = z.object({
  foodAnalysisHistory: z
    .string()
    .describe(
      'A stringified JSON array of the user\'s past food analyses, including food items and nutritional information.'
    ),
  healthGoals: z
    .string()
    .describe(
      'The user\'s health goals, such as weight loss, muscle gain, balanced diet, or diabetes-friendly eating.'
    ),
});
export type HealthierAlternativesInput = z.infer<typeof HealthierAlternativesInputSchema>;

const HealthierAlternativesOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A string containing the recommendations for healthier food choices.'
    ),
});
export type HealthierAlternativesOutput = z.infer<typeof HealthierAlternativesOutputSchema>;

export async function recommendHealthierAlternatives(
  input: HealthierAlternativesInput
): Promise<HealthierAlternativesOutput> {
  return recommendHealthierAlternativesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendHealthierAlternativesPrompt',
  input: {schema: HealthierAlternativesInputSchema},
  output: {schema: HealthierAlternativesOutputSchema},
  prompt: `You are a nutrition expert providing healthier food recommendations.

  Based on the user's past food analysis history:
  {{foodAnalysisHistory}}

  And their health goals:
  {{healthGoals}}

  Provide personalized recommendations for healthier food choices to help them achieve their goals.  Focus on gradual improvements and sustainable changes.
  Format your response as a short paragraph.
  `,
});

const recommendHealthierAlternativesFlow = ai.defineFlow(
  {
    name: 'recommendHealthierAlternativesFlow',
    inputSchema: HealthierAlternativesInputSchema,
    outputSchema: HealthierAlternativesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

