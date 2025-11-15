import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const loginSchema = z
  .object({
    username: z.string().min(1, 'Username is required').openapi({
      description: 'Admin username',
      example: 'demo',
    }),
    password: z.string().min(1, 'Password is required').openapi({
      description: 'Admin password',
      example: 'demo123',
    }),
  })
  .openapi('LoginRequest');

export type LoginInput = z.infer<typeof loginSchema>;
