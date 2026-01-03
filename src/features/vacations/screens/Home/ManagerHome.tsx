import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
  UIManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  Inbox,
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Slash,
  CloudOff,
} from "lucide-react-native";

import { VacationRequest } from "../../types";
import { VacationCard } from "../../components/VacationCard";
import { Dialog } from "@/components/Dialog";
import { User } from "@/types";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useManagerVacations } from "../../hooks/useManagerVacations";
import { HomeHeader } from "../../components/HomeHeader";

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

export function ManagerHome({ user, onLogout }: ManagerHomeProps) {
  const navigation = useNavigation<ManagerNavigationProp>();

  const {
    loading,
    activeTab,
    sortedData,
    sortOrder,
    dialog,
    setDialog,
    toggleSort,
    changeTab,
    loadData,
    totalCount,
  } = useManagerVacations(user.id);

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

      <View className="flex-row px-6 mb-6 gap-x-3">
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

      <View className="flex-row justify-between items-center mb-4 px-6">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {activeTab === "PENDING" ? "Pendências" : "Histórico"}
          </Text>

          {sortedData.some((item) => item.isSyncing) && (
            <View className="ml-3 flex-row items-center bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <CloudOff size={10} color="#D97706" />
              <Text className="text-[9px] text-amber-700 dark:text-amber-500 font-bold ml-1">
                SINC. PENDENTE
              </Text>
            </View>
          )}
        </View>

        {totalCount > 1 && (
          <TouchableOpacity
            onPress={toggleSort}
            className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full"
          >
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">
              {sortOrder === "desc" ? "Recentes" : "Antigas"}
            </Text>
            {sortOrder === "desc" ? (
              <ArrowDown size={12} color="#2563EB" />
            ) : (
              <ArrowUp size={12} color="#2563EB" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ScreenWrapper withScroll={false}>
      <FlatList
        data={sortedData}
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
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
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
                ? "Tudo limpo por aqui!"
                : "Nenhum histórico encontrado."}
            </Text>
          </View>
        }
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
