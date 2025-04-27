
import { z } from "zod";

export const palavrasChavesSchema = z.object({
  palavrasFundo: z.string().min(1, "Este campo é obrigatório"),
});

export type PalavrasChavesFormData = z.infer<typeof palavrasChavesSchema>;

export type PalavrasChavesAnalise = {
  id: string;
  user_id: string;
  palavras_fundo: string[];
  resultado: string;
  created_at: string;
  updated_at: string;
};
