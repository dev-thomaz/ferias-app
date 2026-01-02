import { useState, useCallback, useMemo } from "react";
import { LayoutAnimation } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { managerService } from "../services/managerService";
import { VacationRequest } from "../types";
import { DialogVariant } from "@/components/Dialog";

type TabType = "PENDING" | "HISTORY";

export function useManagerVacations(userId: string) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === "PENDING") {
        result = await managerService.getPendingRequests();
      } else {
        result = await managerService.getManagerHistory(userId);
      }
      setData(result);
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar os dados.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, userId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(
        activeTab === "PENDING" ? a.createdAt : a.updatedAt || ""
      ).getTime();
      const dateB = new Date(
        activeTab === "PENDING" ? b.createdAt : b.updatedAt || ""
      ).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [data, sortOrder, activeTab]);

  const toggleSort = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const changeTab = (tab: TabType) => {
    LayoutAnimation.easeInEaseOut();
    setActiveTab(tab);
  };

  return {
    loading,
    activeTab,
    sortedData,
    sortOrder,
    dialog,
    setDialog,
    toggleSort,
    changeTab,
    loadData,
    totalCount: data.length,
  };
}
