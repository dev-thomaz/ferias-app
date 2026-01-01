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

type VacationItem = VacationRequest & { id: string };

type ManagerStackParamList = {
  VacationDetails: { request: VacationRequest };
};

type ManagerNavigationProp = NativeStackNavigationProp<ManagerStackParamList>;

interface ManagerHomeProps {
  user: User;
  onLogout: () => void;
}

type SortOrder = "asc" | "desc";

export function ManagerHome({ user, onLogout }: ManagerHomeProps) {
  const navigation = useNavigation<ManagerNavigationProp>();

  const [data, setData] = useState<VacationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await managerService.getPendingRequests();
      setData(result as VacationItem[]);
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar as pendências.",
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

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [data, sortOrder]);

  const toggleSort = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const ListHeader = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-8 mt-2">
        <View className="flex-row items-center flex-1">
          <View className="bg-white p-1 rounded-full shadow-sm mr-4 border border-gray-100">
            <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
          </View>
          <View>
            <View className="self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center bg-blue-100">
              <Feather
                name="briefcase"
                size={12}
                color="#1D4ED8"
                style={{ marginRight: 6 }}
              />
              <Text className="text-xs font-bold uppercase tracking-wide text-blue-700">
                Gestor
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

      <View className="w-full p-6 rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-8 relative overflow-hidden">
        <View className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />

        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-blue-100 font-medium mb-1">
              Aguardando Análise
            </Text>
            <Text className="text-5xl font-bold text-white tracking-tight">
              {data.length}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Feather name="inbox" size={24} color="#FFF" />
          </View>
        </View>
        <Text className="text-blue-100/80 text-xs mt-4 font-medium">
          Mantenha a equipe organizada e produtiva.
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-4 px-1">
        <Text className="text-lg font-bold text-gray-800">Pendências</Text>

        {data.length > 1 && (
          <TouchableOpacity
            onPress={toggleSort}
            activeOpacity={0.7}
            className="flex-row items-center bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm"
          >
            <Text className="text-xs font-semibold text-gray-600 mr-2">
              {sortOrder === "desc" ? "Mais Recentes" : "Mais Antigas"}
            </Text>
            <View
              className={`p-1 rounded-full ${
                sortOrder === "desc" ? "bg-blue-100" : "bg-orange-100"
              }`}
            >
              <Feather
                name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
                size={12}
                color={sortOrder === "desc" ? "#2563EB" : "#EA580C"}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      {loading && data.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VacationCard
              item={item}
              onPress={() =>
                navigation.navigate("VacationDetails", { request: item })
              }
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12 opacity-50">
              <View className="bg-gray-100 p-6 rounded-full mb-4">
                <Feather name="check-circle" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-center font-medium">
                Tudo limpo por aqui!
              </Text>
              <Text className="text-gray-400 text-center text-xs mt-1">
                Nenhuma solicitação pendente no momento.
              </Text>
            </View>
          }
        />
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
