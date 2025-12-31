import { format, isValid } from "date-fns";

export const formatDate = (
  dateString: string | Date | undefined | null
): string => {
  if (!dateString) return "--/--/--";

  const date = new Date(dateString);

  if (!isValid(date)) {
    return "--/--/--";
  }

  return format(date, "dd/MM/yy");
};
