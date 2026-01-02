import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { managerService } from "../../services/managerService";
import { VacationRequest } from "../../types";
import { formatShortName } from "@/utils/textUtils";
import { VacationCard } from "../../components/VacationCard";
import { Avatar } from "@/components/Avatar";
import { Dialog, DialogVariant } from "@/components/Dialog";
import { User } from "@/features/auth/store/useAuthStore";

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

type TabType = "PENDING" | "HISTORY";

export function ManagerHome({ user, onLogout }: ManagerHomeProps) {
  const navigation = useNavigation<ManagerNavigationProp>();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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

  const loadData = async () => {
    setLoading(true);
    try {
      let result;
      if (activeTab === "PENDING") {
        result = await managerService.getPendingRequests();
      } else {
        result = await managerService.getManagerHistory(user.id);
      }
      setData(result);
    } catch (error) {
      console.error(error);
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar os dados.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [activeTab])
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

  const ListHeader = () => (
    <View className="mb-2">
      <View className="flex-row justify-between items-center mb-6 mt-2 px-6">
        <View className="flex-row items-center flex-1">
          <View className="bg-surface-light dark:bg-surface-dark p-1 rounded-full shadow-sm mr-4 border border-gray-100 dark:border-gray-800">
            <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
          </View>
          <View className="flex-1">
            <View className="self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center bg-blue-100 dark:bg-blue-900/30">
              <Feather
                name="briefcase"
                size={12}
                color={isDark ? "#60A5FA" : "#1D4ED8"}
                style={{ marginRight: 6 }}
              />
              <Text className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                Gestor
              </Text>
            </View>
            <Text className="text-gray-400 font-medium text-sm">
              Bem-vindo(a),
            </Text>
            <Text
              className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight"
              numberOfLines={1}
            >
              {formatShortName(user.name)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-x-2">
          <TouchableOpacity
            onPress={toggleColorScheme}
            className="bg-surface-light dark:bg-surface-dark p-3.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <Feather
              name={isDark ? "sun" : "moon"}
              size={22}
              color={isDark ? "#FBBF24" : "#1D4ED8"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onLogout}
            className="bg-surface-light dark:bg-surface-dark p-3.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <Feather name="log-out" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

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
              {data.length}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            <Feather
              name={activeTab === "PENDING" ? "inbox" : "archive"}
              size={24}
              color="#FFF"
            />
          </View>
        </View>
      </View>

      <View className="flex-row px-6 mb-6 gap-x-3">
        {(["PENDING", "HISTORY"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              LayoutAnimation.easeInEaseOut();
              setActiveTab(tab);
            }}
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
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {activeTab === "PENDING" ? "Pendências" : "Histórico de Decisões"}
        </Text>
        {data.length > 1 && (
          <TouchableOpacity
            onPress={toggleSort}
            className="flex-row items-center bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full"
          >
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 mr-2">
              {sortOrder === "desc" ? "Recentes" : "Antigas"}
            </Text>
            <Feather
              name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
              size={12}
              color="#2563EB"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
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
          <RefreshControl refreshing={loading} onRefresh={loadData} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12 opacity-50 px-6">
            <View className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
              <Feather
                name={activeTab === "PENDING" ? "check-circle" : "slash"}
                size={40}
                color={isDark ? "#9CA3AF" : "#6B7280"}
              />
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
    </View>
  );
}
