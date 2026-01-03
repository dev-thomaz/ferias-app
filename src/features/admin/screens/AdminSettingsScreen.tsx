import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  ShieldAlert,
  Settings2,
} from "lucide-react-native";
import { configService } from "@/features/vacations/services/configService";
import { VacationConfig } from "@/features/vacations/types";

export function AdminSettingsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [allowConcurrent, setAllowConcurrent] = useState(false);
  const [adminCanManage, setAdminCanManage] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await configService.getVacationConfig();
      setAllowConcurrent(config.allowConcurrentRequests);
      setAdminCanManage(config.adminCanManageVacations);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (
    key: keyof VacationConfig,
    value: boolean
  ) => {
    setSaving(true);
    try {
      if (key === "allowConcurrentRequests") setAllowConcurrent(value);
      if (key === "adminCanManageVacations") setAdminCanManage(value);

      await configService.updateVacationConfig({ [key]: value });
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);

      if (key === "allowConcurrentRequests") setAllowConcurrent(!value);
      if (key === "adminCanManageVacations") setAdminCanManage(!value);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <ActivityIndicator color="#9333EA" size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="bg-purple-700 pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center mb-4"
        >
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Settings2 size={24} color="#E9D5FF" />
          <Text className="text-white font-bold text-2xl ml-3">
            Regras de Negócio
          </Text>
        </View>
        <Text className="text-purple-200 text-xs mt-1">
          Configurações globais de governança do sistema
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 mt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
              <ShieldCheck size={20} color="#9333EA" />
            </View>
            <Switch
              value={allowConcurrent}
              onValueChange={(v) =>
                handleUpdateConfig("allowConcurrentRequests", v)
              }
              trackColor={{ false: "#D1D5DB", true: "#A855F7" }}
              thumbColor="#FFF"
              disabled={saving}
            />
          </View>

          <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-2">
            Solicitações Concorrentes
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
            Permite que colaboradores criem novas solicitações de férias mesmo
            possuindo uma pendente.
          </Text>
        </View>

        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl">
              <ShieldAlert size={20} color="#EA580C" />
            </View>
            <Switch
              value={adminCanManage}
              onValueChange={(v) =>
                handleUpdateConfig("adminCanManageVacations", v)
              }
              trackColor={{ false: "#D1D5DB", true: "#FB923C" }}
              thumbColor="#FFF"
              disabled={saving}
            />
          </View>

          <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-2">
            Admin Gerencia Férias
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5">
            Define se perfis de Administrador podem aprovar ou reprovar férias
            diretamente, ou se a função é exclusiva de Gestores.
          </Text>
        </View>

        <View className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex-row items-start border border-blue-100 dark:border-blue-900/20 mb-6">
          <Info size={16} color="#3B82F6" style={{ marginTop: 2 }} />
          <Text className="text-blue-600 dark:text-blue-400 text-[11px] ml-2 flex-1 font-medium leading-4">
            Nota: Estas alterações são aplicadas globalmente e em tempo real
            para todos os usuários do aplicativo.
          </Text>
        </View>

        {saving && (
          <View className="flex-row items-center justify-center mb-10">
            <ActivityIndicator size="small" color="#9333EA" />
            <Text className="ml-2 text-purple-600 font-bold text-xs uppercase tracking-tighter">
              Atualizando regras no banco...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
