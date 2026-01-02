import { useState, useMemo } from "react";
import { LayoutAnimation } from "react-native";
import { parseISO, differenceInDays } from "date-fns";
import { formatDate } from "@/utils/dateUtils";
import { VacationRequest } from "../types";

export function useVacationDetailsBase(request: VacationRequest) {
  const [isExpanded, setIsExpanded] = useState(false);

  const duration = useMemo(
    () =>
      differenceInDays(parseISO(request.endDate), parseISO(request.startDate)),
    [request.startDate, request.endDate]
  );

  const formattedDates = useMemo(
    () => ({
      creation: formatDate(request.createdAt, "dd 'de' MMMM 'às' HH:mm"),
      update: request.updatedAt
        ? formatDate(request.updatedAt, "dd 'de' MMMM 'às' HH:mm")
        : null,
      start: formatDate(request.startDate),
      end: formatDate(request.endDate),
    }),
    [request]
  );

  const status = useMemo(
    () => ({
      isPending: request.status === "PENDING",
      isApproved:
        request.status === "APPROVED" ||
        (request.status as string) === "COMPLETED",
      isRejected: request.status === "REJECTED",
    }),
    [request.status]
  );

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return { isExpanded, duration, formattedDates, status, toggleAccordion };
}
