import { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  parseISO,
  isFuture,
  isToday,
  differenceInDays,
  startOfDay,
} from "date-fns";
import { vacationService } from "../services/vacationService";
import { VacationRequest, VacationStatus } from "../types";
import { DialogVariant } from "@/components/Dialog";

type VacationItem = VacationRequest & { id: string };
type FilterType = "ALL" | VacationStatus;

export function useEmployeeVacations(userId: string) {
  const [data, setData] = useState<VacationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await vacationService.getUserVacations(userId);
      setData(result as VacationItem[]);
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar seu histórico.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const hasPendingRequest = useMemo(
    () => data.some((item) => item.status === "PENDING"),
    [data]
  );

  const filteredData = useMemo(() => {
    if (activeFilter === "ALL") return data;
    return data.filter((item) => item.status === activeFilter);
  }, [data, activeFilter]);

  const heroInfo = useMemo(() => {
    const pendingCount = data.filter((i) => i.status === "PENDING").length;
    if (pendingCount > 0) {
      return {
        topLabel: "Em Análise",
        mainValue: pendingCount,
        bottomLabel: "Aguardando aprovação.",
        icon: "clock" as const,
        isText: false,
      };
    }

    const upcoming = data
      .filter((i) => i.status === "APPROVED")
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .find(
        (i) => isFuture(parseISO(i.startDate)) || isToday(parseISO(i.startDate))
      );

    if (upcoming) {
      const startDate = startOfDay(parseISO(upcoming.startDate));
      const today = startOfDay(new Date());
      const daysLeft = differenceInDays(startDate, today);

      if (daysLeft <= 0)
        return {
          topLabel: "Boas Férias!",
          mainValue: "É HOJE!",
          bottomLabel: "Desconecte-se e aproveite!",
          icon: "sun" as const,
          isText: true,
        };
      if (daysLeft === 1)
        return {
          topLabel: "Prepare as malas!",
          mainValue: "É AMANHÃ!",
          bottomLabel: "Falta muito pouco.",
          icon: "sun" as const,
          isText: true,
        };

      return {
        topLabel: "Contagem Regressiva",
        mainValue: daysLeft,
        bottomLabel: "Dias para o seu descanso.",
        icon: "calendar" as const,
        isText: false,
      };
    }

    return {
      topLabel: "Status Atual",
      mainValue: "EM DIA",
      bottomLabel: "Nenhuma pendência.",
      icon: "check-circle" as const,
      isText: true,
    };
  }, [data]);

  return {
    data,
    loading,
    filteredData,
    activeFilter,
    setActiveFilter,
    heroInfo,
    hasPendingRequest,
    dialog,
    setDialog,
    loadData,
  };
}
