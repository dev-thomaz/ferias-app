import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, RefreshControl } from "react-native";

import {
  Shield,
  Sun,
  Moon,
  LogOut,
  UserPlus,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  Settings,
  Database,
} from "lucide-react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";

import { User } from "@/types";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { adminService } from "@/features/admin/services/adminService";
import { seedService } from "@/features/vacations/services/seedService";
import { configService } from "@/features/vacations/services/configService";
import { RootStackParamList } from "@/types/navigation";
import { ScreenWrapper } from "@/components/ScreenWrapper";

type AdminNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AdminHomeProps {
  user: User;
  onLogout: () => void;
}

export function AdminHome({ user, onLogout }: AdminHomeProps) {
  const navigation = useNavigation<AdminNavigationProp>();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [pendingUsers, _config] = await Promise.all([
        adminService.getPendingUsers(),
        configService.getVacationConfig(),
      ]);

      setPendingCount(pendingUsers.length);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSeed = async () => {
    setIsSeeding(true);
    try {
      await seedService.run();
      await loadDashboardData();
      alert("Massa de dados gerada com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Falha ao gerar dados.");
    } finally {
      setIsSeeding(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const hasPending = pendingCount > 0;

  return (
    <ScreenWrapper
      withScroll={true}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadDashboardData}
          tintColor="#7C3AED"
        />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="bg-purple-700 pb-10 pt-16 rounded-b-[40px] px-6 shadow-lg shadow-purple-900/20">
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-row items-center">
            <View className="bg-surface-light dark:bg-surface-dark p-1 rounded-full shadow-sm mr-4">
              <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
            </View>
            <View>
              <View className="self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center bg-purple-500/30 border border-purple-400/30">
                <Shield size={12} color="#E9D5FF" style={{ marginRight: 6 }} />
                <Text className="text-xs font-bold uppercase tracking-wide text-purple-100">
                  Administrador
                </Text>
              </View>
              <Text className="text-purple-200 font-medium text-sm">Olá,</Text>
              <Text className="text-2xl font-bold text-white leading-tight">
                {formatShortName(user.name)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-2">
            <TouchableOpacity
              onPress={toggleColorScheme}
              className="bg-purple-600 p-3 rounded-full border border-purple-500 shadow-sm"
            >
              {isDark ? (
                <Sun size={20} color="#E9D5FF" />
              ) : (
                <Moon size={20} color="#E9D5FF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onLogout}
              className="bg-purple-600 p-3 rounded-full border border-purple-500 shadow-sm"
            >
              <LogOut size={20} color="#E9D5FF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="px-6 -mt-8">
        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View
              className={`p-3 rounded-2xl ${
                hasPending ? "bg-orange-100" : "bg-green-100"
              }`}
            >
              {hasPending ? (
                <UserPlus size={24} color="#EA580C" />
              ) : (
                <CheckCircle size={24} color="#16A34A" />
              )}
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

          <Text className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {loading ? "--" : pendingCount}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium mb-4">
            {hasPending
              ? "Novos cadastros aguardando aprovação."
              : "Não há solicitações pendentes."}
          </Text>

          <TouchableOpacity
            onPress={() => hasPending && navigation.navigate("UserApproval")}
            disabled={!hasPending}
            className={`py-3 rounded-xl flex-row justify-center items-center ${
              hasPending ? "bg-orange-500" : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            <Text
              className={`font-bold mr-2 ${
                hasPending ? "text-white" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {hasPending ? "Revisar Cadastros" : "Nenhuma Pendência"}
            </Text>
            {hasPending && <ArrowRight size={16} color="#FFF" />}
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 ml-2">
          Gestão do Sistema
        </Text>

        <View className="flex-row gap-4 mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("EmployeesList")}
            className="flex-1 bg-surface-light dark:bg-surface-dark p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:opacity-70"
          >
            <View className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-full items-center justify-center mb-3">
              <Users size={20} color="#2563EB" />
            </View>
            <Text className="font-bold text-gray-800 dark:text-gray-100 text-base mb-1">
              Equipe
            </Text>
            <Text className="text-xs text-gray-400">Colaboradores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("AllVacations")}
            className="flex-1 bg-surface-light dark:bg-surface-dark p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:opacity-70"
          >
            <View className="bg-emerald-100 dark:bg-emerald-900/30 w-10 h-10 rounded-full items-center justify-center mb-3">
              <Calendar size={20} color="#059669" />
            </View>
            <Text className="font-bold text-gray-800 dark:text-gray-100 text-base mb-1">
              Auditoria
            </Text>
            <Text className="text-xs text-gray-400">Todas as Férias</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("AdminSettings")}
          className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm active:opacity-70 flex-row items-center mb-8"
        >
          <View className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-2xl items-center justify-center mr-4">
            <Settings size={24} color="#9333EA" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-gray-800 dark:text-gray-100 text-base">
              Regras de Negócio
            </Text>
            <Text className="text-xs text-gray-400">
              Configurações globais de férias
            </Text>
          </View>
          <ArrowRight size={18} color="#9333EA" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleRunSeed}
          disabled={isSeeding}
          className="opacity-40 py-4 flex-row justify-center items-center"
        >
          <Database size={14} color="#9CA3AF" />
          <Text className="text-gray-400 text-[10px] ml-2 font-bold uppercase tracking-widest">
            {isSeeding ? "Processando..." : "Gerar massa de dados inicial"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
