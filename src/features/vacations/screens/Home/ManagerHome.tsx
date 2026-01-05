import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  UIManager,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  Inbox,
  Archive,
  CheckCircle,
  Slash,
  CloudOff,
  ArrowDown,
  ArrowUp,
} from "lucide-react-native";

import { VacationRequest, User } from "@/types";
import { VacationCard } from "../../components/VacationCard";
import { Dialog } from "@/components/Dialog";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useManagerVacations } from "../../hooks/useManagerVacations";
import { HomeHeader } from "../../components/HomeHeader";
import { useClientPagination } from "@/hooks/useClientPagination";
import { FilterSortBar } from "@/components/FilterSortBar";

import { translateStatusFilter } from "@/utils/textUtils";

const SPINNER_GIF = require("@assets/spinner.gif");

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ManagerStackParamList = { VacationDetails: { request: VacationRequest } };
type ManagerNavigationProp = NativeStackNavigationProp<ManagerStackParamList>;

interface ManagerHomeProps {
  user: User;
  onLogout: () => void;
}

type HistoryFilterType = "ALL" | "APPROVED" | "REJECTED";

export function ManagerHome({ user, onLogout }: ManagerHomeProps) {
  const navigation = useNavigation<ManagerNavigationProp>();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [historySubFilter, setHistorySubFilter] =
    useState<HistoryFilterType>("ALL");

  const {
    loading,
    activeTab,
    sortedData,
    dialog,
    setDialog,
    changeTab,
    loadData,
    totalCount,
  } = useManagerVacations(user.id);

  const displayedData = useMemo(() => {
    if (activeTab === "PENDING") return sortedData;

    if (historySubFilter === "ALL") return sortedData;

    return sortedData.filter((item) => item.status === historySubFilter);
  }, [sortedData, activeTab, historySubFilter]);

  const {
    data: paginatedData,
    sortOrder,
    toggleSort,
    loadMore,
    resetPagination,
  } = useClientPagination(displayedData, 10);

  useEffect(() => {
    resetPagination();
    if (activeTab === "PENDING") {
      setHistorySubFilter("ALL");
    }
  }, [activeTab]);

  useEffect(() => {
    resetPagination();
  }, [historySubFilter]);

  const onPullToRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadData();
    resetPagination();
    setIsRefreshing(false);
  }, [loadData]);

  const ListHeader = () => (
    <View className="mb-2">
      <HomeHeader user={user} onLogout={onLogout} />

      <View className="mx-6 p-6 rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-8 relative overflow-hidden">
        <View className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-blue-100 font-medium mb-1">
              {activeTab === "PENDING"
                ? "Aguardando Análise"
                : "Total Analisado"}
            </Text>
            <Text className="text-5xl font-bold text-white tracking-tight">
              {totalCount}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            {activeTab === "PENDING" ? (
              <Inbox size={24} color="#FFF" />
            ) : (
              <Archive size={24} color="#FFF" />
            )}
          </View>
        </View>
      </View>

      <View className="flex-row px-6 mb-4 gap-x-3">
        {(["PENDING", "HISTORY"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => changeTab(tab)}
            className={`flex-1 py-3 rounded-2xl border items-center ${
              activeTab === tab
                ? "bg-blue-600 border-blue-600 shadow-sm"
                : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800"
            }`}
          >
            <Text
              className={`font-bold text-xs uppercase tracking-widest ${
                activeTab === tab ? "text-white" : "text-gray-400"
              }`}
            >
              {tab === "PENDING" ? "Pendentes" : "Minhas Respostas"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-between items-center mb-2 px-6">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {activeTab === "PENDING"
              ? "Fila de Aprovação"
              : "Histórico de Decisões"}
          </Text>

          {!loading && sortedData.some((item) => item.isSyncing) && (
            <View className="ml-3 flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <CloudOff size={10} color="#D97706" />
              <Text className="text-[9px] text-amber-700 dark:text-amber-500 font-bold ml-1">
                SYNC
              </Text>
            </View>
          )}
        </View>
      </View>

      {activeTab === "HISTORY" ? (
        <FilterSortBar
          variant="manager"
          layout="stacked"
          filters={[
            { id: "ALL", label: "Todos" },
            { id: "APPROVED", label: "Aprovados" },
            { id: "REJECTED", label: "Reprovados" },
          ]}
          activeFilter={historySubFilter}
          onFilterChange={setHistorySubFilter}
          sortOrder={sortOrder}
          onToggleSort={toggleSort}
          disabled={loading || sortedData.length === 0}
        />
      ) : (
        <View className="flex-row justify-end px-6 mb-4">
          <TouchableOpacity
            onPress={toggleSort}
            disabled={loading || sortedData.length === 0}
            className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 px-3 py-2 rounded-lg flex-row items-center justify-center shadow-sm"
          >
            <Text className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mr-2 uppercase">
              {sortOrder === "desc" ? "Recente" : "Antigo"}
            </Text>
            {sortOrder === "desc" ? (
              <ArrowDown size={14} color="#2563EB" />
            ) : (
              <ArrowUp size={14} color="#2563EB" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

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

    if (displayedData.length > 0) return null;

    return (
      <View className="items-center justify-center py-12 opacity-50 px-6">
        <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          {activeTab === "PENDING" ? (
            <CheckCircle size={40} color="#9CA3AF" />
          ) : (
            <Slash size={40} color="#9CA3AF" />
          )}
        </View>
        <Text className="text-gray-500 dark:text-gray-400 text-center font-bold">
          {activeTab === "PENDING"
            ? "Tudo limpo! Nenhuma pendência."
            : historySubFilter === "ALL"
            ? "Nenhum histórico encontrado."
            : `Nenhum registro em "${translateStatusFilter(
                historySubFilter
              )}".`}
        </Text>
      </View>
    );
  };

  const FooterComponent = () => {
    if (loading) return null;

    if (paginatedData.length >= displayedData.length)
      return <View className="h-20" />;

    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#2563EB" />
      </View>
    );
  };

  return (
    <ScreenWrapper isLoading={false} withScroll={false}>
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
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
            tintColor="#2563EB"
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
        onConfirm={() => setDialog((p) => ({ ...p, visible: false }))}
      />
    </ScreenWrapper>
  );
}
