'use server';

/**
 * @fileOverview A health chatbot that answers nutrition and wellness questions.
 *
 * - healthChat - A function that handles the chatbot conversation.
 * - HealthChatInput - The input type for the healthChat function.
 * - HealthChatOutput - The return type for the healthChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const HealthChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest user message.'),
});
export type HealthChatInput = z.infer<typeof HealthChatInputSchema>;

const HealthChatOutputSchema = z.object({
  response: z
    .string()
    .describe('The chatbot\'s response to the user\'s message.'),
});
export type HealthChatOutput = z.infer<typeof HealthChatOutputSchema>;

export async function healthChat(
  input: HealthChatInput
): Promise<HealthChatOutput> {
  return healthChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthChatPrompt',
  input: {schema: HealthChatInputSchema},
  output: {schema: HealthChatOutputSchema},
  prompt: `You are a friendly and knowledgeable AI nutrition and wellness assistant called NutriBot. Your goal is to provide helpful, safe, and accurate information.

  You are not a medical professional. Always remind the user to consult with a doctor or registered dietitian for personalized medical advice.

  Conversation History:
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}

  User's new message: {{message}}

  Your response:`,
});

const healthChatFlow = ai.defineFlow(
  {
    name: 'healthChatFlow',
    inputSchema: HealthChatInputSchema,
    outputSchema: HealthChatOutputSchema,
  },
  async input => {
    const history = input.history.map(msg => ({
      role: msg.role,
      content: [{text: msg.content}],
    }));

    const response = await ai.generate({
      history,
      prompt: input.message,
    });

    return {response: response.text};
  }
);
