import { z } from "zod";

export const printerSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    wattage: z.number(),
});

export type Printer = z.infer<typeof printerSchema>;