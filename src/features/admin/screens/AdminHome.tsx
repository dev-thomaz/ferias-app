import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { User } from "@/features/auth/store/useAuthStore";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { adminService } from "@/features/admin/services/adminService";
import { RootStackParamList } from "@/types/navigation";

type AdminNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AdminHomeProps {
  user: User;
  onLogout: () => void;
}

export function AdminHome({ user, onLogout }: AdminHomeProps) {
  const navigation = useNavigation<AdminNavigationProp>();

  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const pendingUsers = await adminService.getPendingUsers();
      setPendingCount(pendingUsers.length);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const hasPending = pendingCount > 0;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadDashboard} />
        }
      >
        <View className="bg-purple-700 pb-10 pt-16 rounded-b-[40px] px-6 shadow-lg shadow-purple-900/20">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-row items-center">
              <View className="bg-white p-1 rounded-full shadow-sm mr-4">
                <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
              </View>
              <View>
                <View className="self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center bg-purple-500/30 border border-purple-400/30">
                  <Feather
                    name="shield"
                    size={12}
                    color="#E9D5FF"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-xs font-bold uppercase tracking-wide text-purple-100">
                    Administrador
                  </Text>
                </View>
                <Text className="text-purple-200 font-medium text-sm">
                  Olá,
                </Text>
                <Text className="text-2xl font-bold text-white leading-tight">
                  {formatShortName(user.name)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onLogout}
              className="bg-purple-600 p-3 rounded-full border border-purple-500 shadow-sm"
            >
              <Feather name="log-out" size={20} color="#E9D5FF" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 -mt-8">
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
            <View className="flex-row justify-between items-start mb-4">
              <View
                className={`p-3 rounded-2xl ${
                  hasPending ? "bg-orange-100" : "bg-green-100"
                }`}
              >
                <Feather
                  name={hasPending ? "user-plus" : "check-circle"}
                  size={24}
                  color={hasPending ? "#EA580C" : "#16A34A"}
                />
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  hasPending ? "bg-orange-50" : "bg-green-50"
                }`}
              >
                <Text
                  className={`font-bold text-xs ${
                    hasPending ? "text-orange-700" : "text-green-700"
                  }`}
                >
                  {hasPending ? "Ação Necessária" : "Tudo Certo"}
                </Text>
              </View>
            </View>

            <Text className="text-3xl font-bold text-gray-800 mb-1">
              {loading ? "--" : pendingCount}
            </Text>

            <Text className="text-gray-500 font-medium mb-4">
              {hasPending
                ? "Novos cadastros aguardando aprovação."
                : "Não há solicitações pendentes no momento."}
            </Text>

            <TouchableOpacity
              onPress={() => hasPending && navigation.navigate("UserApproval")}
              disabled={!hasPending}
              className={`py-3 rounded-xl flex-row justify-center items-center ${
                hasPending ? "bg-orange-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-bold mr-2 ${
                  hasPending ? "text-white" : "text-gray-400"
                }`}
              >
                {hasPending ? "Revisar Cadastros" : "Nenhuma Pendência"}
              </Text>
              {hasPending && (
                <Feather name="arrow-right" size={16} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold text-gray-800 mb-4 ml-2">
            Gestão do Sistema
          </Text>

          <View className="flex-row gap-4 mb-4">
            <TouchableOpacity
              onPress={() => navigation.navigate("EmployeesList")}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm active:bg-gray-50"
            >
              <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <Feather name="users" size={20} color="#2563EB" />
              </View>
              <Text className="font-bold text-gray-800 text-base mb-1">
                Colaboradores
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("AllVacations")}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm active:bg-gray-50"
            >
              <View className="bg-emerald-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <Feather name="calendar" size={20} color="#059669" />
              </View>
              <Text className="font-bold text-gray-800 text-base mb-1">
                Todas as Férias
              </Text>
              <Text className="text-xs text-gray-400">Auditoria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
