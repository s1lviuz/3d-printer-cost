import { z } from 'zod';

export const regionCostsSchema = z.object({
    id: z.number().optional(),
    region: z.string(),
    cost: z.number()
});

export type RegionCosts = z.infer<typeof regionCostsSchema>;