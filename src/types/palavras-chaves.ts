
import { z } from "zod";

export const palavrasChavesSchema = z.object({
  palavrasFundo: z.string().min(1, "Este campo é obrigatório"),
});

export type PalavrasChavesFormData = z.infer<typeof palavrasChavesSchema>;
