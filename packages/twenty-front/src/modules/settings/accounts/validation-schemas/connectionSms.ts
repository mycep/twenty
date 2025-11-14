import { z } from 'zod';

export const connectionSms = z.object({
  handle: z.string().min(1, 'Phone number is required'),
  apiKey: z.string().min(1, 'API key is required'),
  secretKey: z.string().min(1, 'Secret key is required'),
  lineNumber: z.string().optional(),
});

export type ConnectionSmsFormData = z.infer<typeof connectionSms>;

