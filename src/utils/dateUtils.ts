import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (
  dateString: string | Date | undefined | null,
  pattern: string = "dd/MM/yy"
): string => {
  if (!dateString) return "--/--/--";

  const date = new Date(dateString);

  if (!isValid(date)) {
    return "--/--/--";
  }

  return format(date, pattern, { locale: ptBR });
};
