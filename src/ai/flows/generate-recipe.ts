'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a recipe.
 *
 * - generateRecipe - A function that creates a recipe based on user goals and optional ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  healthGoal: z
    .string()
    .describe(
      "The user's health goal, such as weight loss, muscle gain, balanced diet, or diabetes-friendly eating."
    ),
  ingredients: z
    .string()
    .optional()
    .describe('A comma-separated list of ingredients the user has on hand.'),
});
export type GenerateRecipeInput = z.infer<
  typeof GenerateRecipeInputSchema
>;

const GenerateRecipeOutputSchema = z.object({
    recipeName: z.string().describe('The name of the recipe.'),
    description: z.string().describe('A short, enticing description of the recipe.'),
    prepTime: z.string().describe('Estimated preparation time.'),
    cookTime: z.string().describe('Estimated cooking time.'),
    servings: z.string().describe('Number of servings the recipe makes.'),
    ingredients: z.array(z.string()).describe('List of ingredients for the recipe.'),
    instructions: z.array(z.string()).describe('Step-by-step cooking instructions.'),
});
export type GenerateRecipeOutput = z.infer<
  typeof GenerateRecipeOutputSchema
>;

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are an expert chef who creates healthy and delicious recipes. Generate a recipe based on the user's health goal.

Health Goal: {{healthGoal}}

{{#if ingredients}}
The user has the following ingredients available, try to incorporate them into the recipe: {{ingredients}}. You can include other ingredients as needed.
{{else}}
The recipe can use any common ingredients.
{{/if}}

Provide a creative name for the recipe, a brief description, prep time, cook time, servings, a list of ingredients, and step-by-step instructions.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
