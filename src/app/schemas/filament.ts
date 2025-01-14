import { z } from 'zod';

export const filamentSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    color: z.string(),
    material: z.string(),
    cost: z.number()
});

export type Filament = z.infer<typeof filamentSchema>;