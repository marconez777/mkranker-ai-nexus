
import { z } from "zod";

export const mercadoPublicoAlvoSchema = z.object({
  nicho: z.string().min(1, "O nicho é obrigatório"),
  servicoFoco: z.string().min(1, "O serviço em foco é obrigatório"),
  segmentos: z.array(z.string()).min(1, "Pelo menos um segmento é obrigatório"),
  problema: z.string().min(1, "O problema é obrigatório")
});

export type MercadoPublicoAlvoFormData = z.infer<typeof mercadoPublicoAlvoSchema>;
