import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  ShieldCheck,
  Info,
  ShieldAlert,
  Settings2,
  CalendarClock,
  Minus,
  Plus,
  Save,
  RotateCcw,
} from "lucide-react-native";

import { useAdminConfig } from "@/features/admin/hooks/useAdminConfig";
import { VacationConfig } from "@/types";
import { Dialog } from "@/components/Dialog";
import { ScreenWrapper } from "@/components/ScreenWrapper";

const PRESET_DAYS = [1, 7, 15, 30];

export function AdminSettingsScreen() {
  const navigation = useNavigation();

  const {
    loading,
    saving,
    serverConfig,
    saveBatchConfig,
    dialog,
    closeDialog,
  } = useAdminConfig();

  const [localConfig, setLocalConfig] = useState<VacationConfig | null>(null);
  const [daysInput, setDaysInput] = useState("");

  useEffect(() => {
    if (serverConfig) {
      setLocalConfig(serverConfig);
      setDaysInput(String(serverConfig.minDaysNotice));
    }
  }, [serverConfig]);

  const hasChanges =
    JSON.stringify(localConfig) !== JSON.stringify(serverConfig);

  const handleUpdateLocal = <K extends keyof VacationConfig>(
    key: K,
    value: VacationConfig[K]
  ) => {
    if (!localConfig) return;

    setLocalConfig((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });

    if (key === "minDaysNotice") {
      setDaysInput(String(value));
    }
  };

  const handleIncrementDays = () => {
    if (!localConfig) return;
    handleUpdateLocal("minDaysNotice", localConfig.minDaysNotice + 1);
  };

  const handleDecrementDays = () => {
    if (!localConfig || localConfig.minDaysNotice <= 0) return;
    handleUpdateLocal("minDaysNotice", localConfig.minDaysNotice - 1);
  };

  const handleManualInputEnd = () => {
    const val = parseInt(daysInput, 10);
    if (!isNaN(val) && val >= 0) {
      handleUpdateLocal("minDaysNotice", val);
    } else {
      setDaysInput(String(localConfig?.minDaysNotice ?? 0));
    }
  };

  const handleSave = async () => {
    if (!localConfig) return;
    Keyboard.dismiss();
    await saveBatchConfig(localConfig);
  };

  const handleDiscard = () => {
    if (serverConfig) {
      setLocalConfig(serverConfig);
      setDaysInput(String(serverConfig.minDaysNotice));
      Keyboard.dismiss();
    }
  };

  return (
    <ScreenWrapper isLoading={loading || !localConfig} withScroll={false}>
      <View className="flex-1 bg-background-light dark:bg-background-dark">
        <View className="bg-purple-700 pt-12 pb-8 px-6 rounded-b-[40px] shadow-lg z-10">
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
            Modifique e salve para aplicar globalmente.
          </Text>
        </View>

        {localConfig && (
          <ScrollView
            className="flex-1 px-6 mt-6"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-xl">
                  <CalendarClock size={20} color="#0891B2" />
                </View>

                <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700">
                  <TouchableOpacity
                    onPress={handleDecrementDays}
                    className="w-10 h-10 items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm active:opacity-70"
                  >
                    <Minus size={16} color="#374151" />
                  </TouchableOpacity>

                  <TextInput
                    className="w-14 text-center font-bold text-gray-800 dark:text-gray-100 text-lg p-0"
                    keyboardType="numeric"
                    value={daysInput}
                    onChangeText={setDaysInput}
                    onEndEditing={handleManualInputEnd}
                    selectTextOnFocus
                  />

                  <TouchableOpacity
                    onPress={handleIncrementDays}
                    className="w-10 h-10 items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm active:opacity-70"
                  >
                    <Plus size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-2">
                Antecedência Mínima
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm leading-5 mb-4">
                Dias de antecedência necessários para solicitar.
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {PRESET_DAYS.map((days) => {
                  const isActive = localConfig.minDaysNotice === days;
                  return (
                    <TouchableOpacity
                      key={days}
                      onPress={() => handleUpdateLocal("minDaysNotice", days)}
                      className={`px-3 py-1.5 rounded-lg border ${
                        isActive
                          ? "bg-cyan-100 border-cyan-200 dark:bg-cyan-900/40 dark:border-cyan-800"
                          : "bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          isActive
                            ? "text-cyan-700 dark:text-cyan-300"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {days} {days === 1 ? "dia" : "dias"}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
                  <ShieldCheck size={20} color="#9333EA" />
                </View>
                <Switch
                  value={localConfig.allowConcurrentRequests}
                  onValueChange={(v) =>
                    handleUpdateLocal("allowConcurrentRequests", v)
                  }
                  trackColor={{ false: "#D1D5DB", true: "#A855F7" }}
                  thumbColor="#FFF"
                />
              </View>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-1">
                Solicitações Concorrentes
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Permitir múltiplas solicitações pendentes.
              </Text>
            </View>

            <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <View className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl">
                  <ShieldAlert size={20} color="#EA580C" />
                </View>
                <Switch
                  value={localConfig.adminCanManageVacations}
                  onValueChange={(v) =>
                    handleUpdateLocal("adminCanManageVacations", v)
                  }
                  trackColor={{ false: "#D1D5DB", true: "#FB923C" }}
                  thumbColor="#FFF"
                />
              </View>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-1">
                Admin Gerencia Férias
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Admin pode aprovar/reprovar férias.
              </Text>
            </View>

            <View className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex-row items-start border border-blue-100 dark:border-blue-900/20 mb-6">
              <Info size={16} color="#3B82F6" style={{ marginTop: 2 }} />
              <Text className="text-blue-600 dark:text-blue-400 text-[11px] ml-2 flex-1 font-medium leading-4">
                Nota: Clique em "Salvar Alterações" para aplicar as novas
                regras.
              </Text>
            </View>
          </ScrollView>
        )}

        {hasChanges && (
          <View className="absolute bottom-8 left-6 right-6 flex-row gap-3">
            <TouchableOpacity
              onPress={handleDiscard}
              disabled={saving}
              className="flex-1 bg-gray-200 dark:bg-gray-700 py-4 rounded-2xl items-center flex-row justify-center shadow-lg"
            >
              <RotateCcw size={20} color="#6B7280" />
              <Text className="ml-2 font-bold text-gray-600 dark:text-gray-300">
                Descartar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="flex-[2] bg-purple-600 py-4 rounded-2xl items-center flex-row justify-center shadow-lg shadow-purple-600/40"
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Save size={20} color="#FFF" />
                  <Text className="ml-2 font-bold text-white uppercase tracking-wider text-sm">
                    Salvar Alterações
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <Dialog
          visible={dialog.visible}
          title={dialog.title}
          message={dialog.message}
          variant={dialog.variant}
          onConfirm={closeDialog}
        />
      </View>
    </ScreenWrapper>
  );
}
