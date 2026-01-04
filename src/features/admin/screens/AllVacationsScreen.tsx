import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";

import { ArrowLeft, ClipboardList, Filter } from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { adminService } from "@/features/admin/services/adminService";
import { VacationRequest, VacationStatus } from "@/features/vacations/types";
import { translateStatusFilter } from "@/utils/textUtils";
import { VacationCard } from "@/features/vacations/components/VacationCard";
import { Dialog, DialogVariant } from "@/components/Dialog";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useClientPagination } from "@/hooks/useClientPagination";
import { FilterSortBar } from "@/components/FilterSortBar";

const SPINNER_GIF = require("@assets/spinner.gif");

type FilterType = "ALL" | VacationStatus;

export function AllVacationsScreen() {
  const navigation = useNavigation<any>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [rawData, setRawData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const {
    data: paginatedData,
    sortOrder,
    toggleSort,
    loadMore,
    resetPagination,
  } = useClientPagination(rawData, 10);

  const loadData = async (filterToUse: FilterType) => {
    if (!isRefreshing) setLoading(true);

    try {
      const result = await adminService.getAllVacations(filterToUse);
      setRawData(result);
      resetPagination();
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar o histórico.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData(activeFilter);
    }, [activeFilter])
  );

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await loadData(activeFilter);
    setIsRefreshing(false);
  };

  const handleTabChange = (newFilter: FilterType) => {
    if (newFilter === activeFilter) return;
    setActiveFilter(newFilter);
  };

  const EmptyComponent = () => {
    if (loading) {
      return (
        <View className="items-center justify-center py-20">
          <Image
            source={SPINNER_GIF}
            style={{ width: 120, height: 120, borderRadius: 20 }}
            resizeMode="contain"
          />
        </View>
      );
    }

    if (rawData.length > 0) return null;

    return (
      <View className="items-center justify-center py-20 opacity-50 px-6">
        {activeFilter === "ALL" ? (
          <ClipboardList size={48} color={isDark ? "#4B5563" : "#9CA3AF"} />
        ) : (
          <Filter size={48} color={isDark ? "#4B5563" : "#9CA3AF"} />
        )}
        <Text className="text-gray-400 dark:text-gray-500 text-center font-bold mt-4">
          {activeFilter === "ALL"
            ? "Nenhuma solicitação no sistema."
            : `Nenhum registro para "${translateStatusFilter(
                activeFilter as any
              )}".`}
        </Text>
      </View>
    );
  };

  const FooterComponent = () => {
    if (loading) return null;

    if (paginatedData.length >= rawData.length)
      return <View className="h-20" />;

    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#9333EA" />
      </View>
    );
  };

  return (
    <ScreenWrapper withScroll={false} isLoading={false}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-surface-light dark:bg-surface-dark pt-12 pb-4 px-6 border-b border-gray-100 dark:border-gray-800 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2 rounded-full"
          >
            <ArrowLeft size={24} color={isDark ? "#F3F4F6" : "#374151"} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
            Auditoria Geral
          </Text>
        </View>

        {!loading && (
          <View className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/50">
            <Text className="text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase">
              {rawData.length} Encontrados
            </Text>
          </View>
        )}
      </View>

      <FilterSortBar
        layout="stacked"
        variant="admin"
        filters={[
          { id: "ALL", label: "Todos" },
          { id: "PENDING", label: "Pendentes" },
          { id: "APPROVED", label: "Aprovados" },
          { id: "COMPLETED", label: "Concluídos" },
          { id: "REJECTED", label: "Reprovados" },
        ]}
        activeFilter={activeFilter}
        onFilterChange={handleTabChange}
        sortOrder={sortOrder}
        onToggleSort={toggleSort}
        disabled={loading}
      />

      <FlatList
        data={loading ? [] : paginatedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-6">
            <VacationCard
              item={item}
              onPress={() =>
                navigation.navigate("VacationDetails", { request: item })
              }
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
            tintColor="#9333EA"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<FooterComponent />}
        ListEmptyComponent={<EmptyComponent />}
      />

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={() => setDialog((prev) => ({ ...prev, visible: false }))}
      />
    </ScreenWrapper>
  );
}
