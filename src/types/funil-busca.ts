
import { z } from "zod";

export const funilBuscaSchema = z.object({
  microNicho: z.string().min(1, "O micro nicho é obrigatório"),
  publicoAlvo: z.string().min(1, "O público alvo é obrigatório"),
  segmento: z.string().min(1, "O segmento é obrigatório")
});

export type FunilBuscaFormData = z.infer<typeof funilBuscaSchema>;
