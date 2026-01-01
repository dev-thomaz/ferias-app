import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import {
  parseISO,
  isFuture,
  differenceInDays,
  isToday,
  startOfDay,
} from "date-fns";

import { vacationService } from "../../services/vacationService";
import { VacationRequest, VacationStatus } from "../../types";
import { formatShortName, translateStatusFilter } from "@/utils/textUtils";
import { VacationCard } from "../../components/VacationCard";
import { Avatar } from "@/components/Avatar";
import { Dialog, DialogVariant } from "@/components/Dialog";
import { User } from "@/features/auth/store/useAuthStore";

type VacationItem = VacationRequest & { id: string };

type EmployeeStackParamList = {
  VacationDetails: { request: VacationRequest };
  NewVacation: undefined;
};

type EmployeeNavigationProp = NativeStackNavigationProp<EmployeeStackParamList>;

interface EmployeeHomeProps {
  user: User;
  onLogout: () => void;
}

type FilterType = "ALL" | VacationStatus;

export function EmployeeHome({ user, onLogout }: EmployeeHomeProps) {
  const navigation = useNavigation<EmployeeNavigationProp>();

  const [data, setData] = useState<VacationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await vacationService.getUserVacations(user.id);
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
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const hasPendingRequest = useMemo(() => {
    return data.some((item) => item.status === "PENDING");
  }, [data]);

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

    const upcomingVacation = data
      .filter((i) => i.status === "APPROVED")
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .find(
        (i) => isFuture(parseISO(i.startDate)) || isToday(parseISO(i.startDate))
      );

    if (upcomingVacation) {
      const startDate = startOfDay(parseISO(upcomingVacation.startDate));
      const today = startOfDay(new Date());

      const daysLeft = differenceInDays(startDate, today);

      if (daysLeft <= 0) {
        return {
          topLabel: "Boas Férias!",
          mainValue: "É HOJE!",
          bottomLabel: "Desconecte-se e aproveite!",
          icon: "sun" as const,
          isText: true,
        };
      }

      if (daysLeft === 1) {
        return {
          topLabel: "Prepare as malas!",
          mainValue: "É AMANHÃ!",
          bottomLabel: "Falta muito pouco para relaxar.",
          icon: "sun" as const,
          isText: true,
        };
      }

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

  const FilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pl-6 mb-4 mt-2"
      contentContainerStyle={{ paddingRight: 24 }}
    >
      {[
        { id: "ALL", label: "Todos" },
        { id: "PENDING", label: "Pendentes" },
        { id: "APPROVED", label: "Aprovados" },
        { id: "REJECTED", label: "Reprovados" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => setActiveFilter(tab.id as FilterType)}
          className={`mr-3 px-4 py-2 rounded-full border ${
            activeFilter === tab.id
              ? "bg-emerald-600 border-emerald-600"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeFilter === tab.id ? "text-white" : "text-gray-600"
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
      <View className="flex-row justify-between items-center mb-6 mt-2 px-6">
        <View className="flex-row items-center flex-1">
          <View className="bg-white p-1 rounded-full shadow-sm mr-4 border border-gray-100">
            <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
          </View>
          <View>
            <View className="self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center bg-emerald-100">
              <Feather
                name="user"
                size={12}
                color="#047857"
                style={{ marginRight: 6 }}
              />
              <Text className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Colaborador
              </Text>
            </View>
            <Text className="text-gray-400 font-medium text-sm">
              Bem-vindo(a),
            </Text>
            <Text className="text-2xl font-bold text-gray-800 leading-tight">
              {formatShortName(user.name)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onLogout}
          className="bg-white p-3.5 rounded-full border border-gray-100 shadow-sm active:bg-gray-50"
        >
          <Feather name="log-out" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View className="mx-6 p-6 rounded-3xl bg-emerald-600 shadow-lg shadow-emerald-500/30 mb-6">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white/80 font-medium mb-1">
              {heroInfo.topLabel}
            </Text>
            <Text
              className={`${
                heroInfo.isText ? "text-3xl mt-1" : "text-5xl"
              } font-bold text-white tracking-tight`}
            >
              {heroInfo.mainValue}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            <Feather name={heroInfo.icon} size={24} color="#FFF" />
          </View>
        </View>
        <Text className="text-white/80 text-xs mt-4 font-medium">
          {heroInfo.bottomLabel}
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-4 px-6">
        Histórico de Solicitações
      </Text>

      <FilterTabs />
    </View>
  );

  return (
    <View className="flex-1">
      {loading && data.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#059669" />
        </View>
      ) : (
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
          contentContainerStyle={{ paddingBottom: 100 }}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12 opacity-50 px-6">
              <Feather
                name={activeFilter === "ALL" ? "clipboard" : "filter"}
                size={48}
                color="#9CA3AF"
              />
              <Text className="text-gray-400 text-center mt-4 font-medium leading-relaxed">
                {activeFilter === "ALL"
                  ? "Você ainda não tem\nsolicitações registradas."
                  : `Nenhuma solicitação encontrada\nno filtro "${translateStatusFilter(
                      activeFilter
                    )}".`}
              </Text>
            </View>
          }
        />
      )}

      {!hasPendingRequest && !loading && (
        <View className="absolute bottom-8 right-6 shadow-xl shadow-emerald-500/40">
          <TouchableOpacity
            className="bg-emerald-600 flex-row items-center px-6 py-4 rounded-full"
            activeOpacity={0.8}
            onPress={() => navigation.navigate("NewVacation")}
          >
            <Feather name="plus" size={24} color="#FFF" />
            <Text className="text-white font-bold ml-2 text-base">
              Nova Solicitação
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={() => setDialog((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
