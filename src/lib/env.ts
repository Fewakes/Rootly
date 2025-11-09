import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url({
    message: 'VITE_SUPABASE_URL must be a valid URL. Check your environment configuration.',
  }),
  VITE_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'VITE_SUPABASE_ANON_KEY is missing. Add it to your environment configuration.'),
});

const parsedEnv = envSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

if (!parsedEnv.success) {
  console.error('Environment validation failed:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Fix the errors above and restart the app.');
}

export const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = parsedEnv.data;
