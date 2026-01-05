import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Plus,
  Layers,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  LucideIcon,
  CloudOff,
  Sun,
} from "lucide-react-native";

import { VacationRequest, User, VacationStatus } from "@/types";
import { VacationCard } from "../../components/VacationCard";
import { Dialog } from "@/components/Dialog";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useEmployeeVacations } from "../../hooks/useEmployeeVacations";
import { HomeHeader } from "../../components/HomeHeader";
import { useClientPagination } from "@/hooks/useClientPagination";
import { FilterSortBar } from "@/components/FilterSortBar";
import { translateStatusFilter } from "@/utils/textUtils";

const SPINNER_GIF = require("@assets/spinner.gif");

type EmployeeStackParamList = {
  VacationDetails: { request: VacationRequest };
  NewVacation: undefined;
};

type EmployeeNavigationProp = NativeStackNavigationProp<EmployeeStackParamList>;

interface EmployeeHomeProps {
  user: User;
  onLogout: () => void;
}

const getIconComponent = (iconName: string): LucideIcon => {
  switch (iconName) {
    case "clock":
      return Clock;
      return CheckCircle;
    case "alert-circle":
      return AlertCircle;
    case "calendar":
      return Calendar;
    case "sun":
      return Sun;
    default:
      return Calendar;
  }
};

export function EmployeeHome({ user, onLogout }: EmployeeHomeProps) {
  const navigation = useNavigation<EmployeeNavigationProp>();

  const {
    loading,
    filteredData,
    activeFilter,
    setActiveFilter,
    heroInfo,
    canCreateRequest,
    dialog,
    setDialog,
    loadData,
  } = useEmployeeVacations(user.id);

  const {
    data: paginatedData,
    sortOrder,
    toggleSort,
    loadMore,
    resetPagination,
  } = useClientPagination(filteredData, 10);

  const isSyncingAnything = filteredData.some((item) => item.isSyncing);
  const HeroIcon = getIconComponent(heroInfo.icon);

  useEffect(() => {
    resetPagination();
  }, [activeFilter, resetPagination]);

  const onPullToRefresh = async () => {
    await loadData();
    resetPagination();
  };

  const renderHeader = useCallback(
    () => (
      <View className="mb-2">
        <HomeHeader user={user} onLogout={onLogout} />

        <View className="mx-6 p-6 rounded-3xl bg-emerald-600 shadow-lg shadow-emerald-500/30 mb-6">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-white/80 font-medium">
                {heroInfo.topLabel}
              </Text>
              <Text
                className={`${
                  heroInfo.isText ? "text-3xl" : "text-5xl"
                } font-bold text-white tracking-tight`}
              >
                {heroInfo.mainValue}
              </Text>
            </View>
            <View className="bg-white/20 p-3 rounded-2xl">
              <HeroIcon size={28} color="#FFF" />
            </View>
          </View>
          <Text className="text-white/80 text-xs mt-4 font-medium">
            {heroInfo.bottomLabel}
          </Text>
        </View>

        <View className="flex-row justify-between items-center px-6 mb-3">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Histórico
          </Text>

          {isSyncingAnything && (
            <View className="flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <CloudOff size={10} color="#D97706" />
              <Text className="text-[9px] text-amber-700 dark:text-amber-500 font-bold ml-1 uppercase">
                Sincronizando...
              </Text>
            </View>
          )}
        </View>

        <FilterSortBar
          variant="employee"
          layout="stacked"
          filters={[
            { id: "ALL", label: "Todos" },
            { id: "PENDING", label: "Pendentes" },
            { id: "APPROVED", label: "Aprovados" },
            { id: "COMPLETED", label: "Concluídos" },
            { id: "REJECTED", label: "Reprovados" },
          ]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortOrder={sortOrder}
          onToggleSort={toggleSort}
          disabled={loading}
        />
      </View>
    ),
    [
      user,
      onLogout,
      heroInfo,
      isSyncingAnything,
      activeFilter,
      setActiveFilter,
      sortOrder,
      toggleSort,
      loading,
    ]
  );

  const renderItem = useCallback(
    ({ item }: { item: VacationRequest }) => (
      <View className="px-6">
        <VacationCard
          item={item}
          onPress={() =>
            navigation.navigate("VacationDetails", { request: item })
          }
        />
      </View>
    ),
    [navigation]
  );

  const loadingSpinnerElement = useMemo(
    () => (
      <View className="items-center justify-center py-20">
        <Image
          source={SPINNER_GIF}
          style={{ width: 120, height: 120, borderRadius: 20 }}
          resizeMode="contain"
        />
      </View>
    ),
    []
  );

  const emptyListElement = useMemo(
    () => (
      <View className="items-center py-20 opacity-40">
        <Layers size={48} color="#9CA3AF" />
        <Text className="text-gray-500 mt-4 text-center px-6">
          {activeFilter === "ALL"
            ? "Nenhuma solicitação encontrada."
            : `Nenhum registro em "${translateStatusFilter(activeFilter)}".`}
        </Text>
      </View>
    ),
    [activeFilter]
  );

  const FooterComponent = useCallback(() => {
    if (loading) return null;
    if (paginatedData.length >= filteredData.length)
      return <View className="h-20" />;

    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  }, [loading, paginatedData.length, filteredData.length]);

  return (
    <ScreenWrapper isLoading={false} withScroll={false}>
      <FlatList
        data={loading ? [] : paginatedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onPullToRefresh}
            tintColor="#10B981"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={FooterComponent}
        ListEmptyComponent={loading ? loadingSpinnerElement : emptyListElement}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      {canCreateRequest && !loading && (
        <TouchableOpacity
          activeOpacity={0.8}
          className="absolute bottom-8 right-6 bg-emerald-600 flex-row items-center px-6 py-4 rounded-full shadow-xl shadow-emerald-600/40"
          onPress={() => navigation.navigate("NewVacation")}
        >
          <Plus size={24} color="#FFF" />
          <Text className="text-white font-bold ml-2">Nova Solicitação</Text>
        </TouchableOpacity>
      )}

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={() => setDialog((d) => ({ ...d, visible: false }))}
      />
    </ScreenWrapper>
  );
}
