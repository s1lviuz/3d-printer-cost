import { z } from 'zod';

export const regionCostsSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    kwhCost: z.number()
});

export type RegionCosts = z.infer<typeof regionCostsSchema>;