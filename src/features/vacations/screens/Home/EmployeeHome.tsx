import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { VacationRequest } from "../../types";
import { VacationCard } from "../../components/VacationCard";
import { Dialog } from "@/components/Dialog";
import { User } from "@/features/auth/store/useAuthStore";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useEmployeeVacations } from "../../hooks/useEmployeeVacations";

import { HomeHeader } from "../../components/HomeHeader";

type EmployeeStackParamList = {
  VacationDetails: { request: VacationRequest };
  NewVacation: undefined;
};

type EmployeeNavigationProp = NativeStackNavigationProp<EmployeeStackParamList>;

interface EmployeeHomeProps {
  user: User;
  onLogout: () => void;
}

export function EmployeeHome({ user, onLogout }: EmployeeHomeProps) {
  const navigation = useNavigation<EmployeeNavigationProp>();

  const {
    loading,
    filteredData,
    activeFilter,
    setActiveFilter,
    heroInfo,
    hasPendingRequest,
    dialog,
    setDialog,
    loadData,
  } = useEmployeeVacations(user.id);

  const FilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pl-6 mb-4 mt-2"
      contentContainerStyle={{ paddingRight: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {[
        { id: "ALL", label: "Todos" },
        { id: "PENDING", label: "Pendentes" },
        { id: "APPROVED", label: "Aprovados" },
        { id: "CONCLUDED", label: "Concluídos" },
        { id: "REJECTED", label: "Reprovados" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => setActiveFilter(tab.id as any)}
          className={`mr-3 px-4 py-2 rounded-full border ${
            activeFilter === tab.id
              ? "bg-emerald-600 border-emerald-600"
              : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeFilter === tab.id
                ? "text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const ListHeader = () => (
    <View className="mb-2">
      {/* Componente Desacoplado que centraliza Perfil/Tema/Logout */}
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
            <Feather name={heroInfo.icon} size={28} color="#FFF" />
          </View>
        </View>
        <Text className="text-white/80 text-xs mt-4 font-medium">
          {heroInfo.bottomLabel}
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 px-6 mb-2">
        Histórico
      </Text>
      <FilterTabs />
    </View>
  );

  return (
    <ScreenWrapper withScroll={false}>
      <FlatList
        data={filteredData}
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
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor="#10B981"
          />
        }
        ListEmptyComponent={
          <View className="items-center py-20 opacity-40">
            <Feather name="layers" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4">
              Nenhuma solicitação encontrada.
            </Text>
          </View>
        }
      />

      {!hasPendingRequest && !loading && (
        <TouchableOpacity
          activeOpacity={0.8}
          className="absolute bottom-8 right-6 bg-emerald-600 flex-row items-center px-6 py-4 rounded-full shadow-xl shadow-emerald-600/40"
          onPress={() => navigation.navigate("NewVacation")}
        >
          <Feather name="plus" size={24} color="#FFF" />
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
