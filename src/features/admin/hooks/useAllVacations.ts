import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { adminService } from "@/features/admin/services/adminService";
import { VacationRequest, VacationStatus, DialogState } from "@/types";
import { useClientPagination } from "@/hooks/useClientPagination";
import { RootStackParamList } from "@/types/navigation";

type FilterType = "ALL" | VacationStatus;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAllVacations() {
  const navigation = useNavigation<NavigationProp>();

  const [rawData, setRawData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const {
    data: paginatedData,
    sortOrder,
    toggleSort,
    loadMore,
    resetPagination,
  } = useClientPagination(rawData, 10);

  const fetchData = useCallback(
    async (filterToUse: FilterType, showLoading = true) => {
      if (showLoading) setLoading(true);

      try {
        const result = await adminService.getAllVacations(filterToUse);
        setRawData(result);

        resetPagination();
      } catch (error) {
        console.error(error);
        setDialog({
          visible: true,
          title: "Erro",
          message: "Não foi possível carregar o histórico.",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
    [resetPagination]
  );

  useFocusEffect(
    useCallback(() => {
      fetchData(activeFilter);
    }, [activeFilter, fetchData])
  );

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(activeFilter, false);
    setIsRefreshing(false);
  };

  const handleTabChange = (newFilter: FilterType) => {
    if (newFilter === activeFilter) return;
    setActiveFilter(newFilter);
  };

  const navigateToDetails = (request: VacationRequest) => {
    navigation.navigate("VacationDetails", { request });
  };

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  return {
    paginatedData,
    totalCount: rawData.length,
    loading,
    isRefreshing,
    activeFilter,
    dialog,

    sortOrder,
    toggleSort,
    loadMore,
    hasMoreData: paginatedData.length < rawData.length,

    onPullToRefresh,
    handleTabChange,
    navigateToDetails,
    closeDialog,
    goBack: navigation.goBack,
  };
}
