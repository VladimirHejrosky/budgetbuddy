import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Název je povinný').max(50, "Příliš dlouhý název"),
  type: z.enum(['income', 'expense'], {
    required_error: 'Typ je povinný',
  }),
  color: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Neplatná barva'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
