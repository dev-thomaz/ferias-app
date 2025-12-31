import * as z from "zod";
import { isBefore } from "date-fns";

export const vacationSchema = z
  .object({
    startDate: z.string().min(1, "Data de início é obrigatória"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    observation: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return !isBefore(end, start);
    },
    {
      message: "A data de término não pode ser anterior à data de início",
      path: ["endDate"],
    }
  );

export type VacationFormData = z.infer<typeof vacationSchema>;
