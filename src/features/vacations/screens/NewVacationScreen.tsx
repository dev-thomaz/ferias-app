import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, differenceInDays } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { vacationService } from "../services/vacationService";
import { CreateVacationDTO } from "../types";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/dateUtils";
import { Dialog, DialogVariant } from "@/components/Dialog";

export function NewVacationScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
    onConfirm: () => {},
  });

  const duration = useMemo(() => {
    const diff = differenceInDays(endDate, startDate);
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  const handleCreate = async () => {
    if (!user) return;

    if (duration <= 0) {
      setDialog({
        visible: true,
        title: "Datas Inválidas",
        message: "A data final deve ser posterior à data inicial.",
        variant: "warning",
        onConfirm: closeDialog,
      });
      return;
    }

    setLoading(true);
    try {
      const currentUser = user as any;
      const safeUserAvatarId =
        currentUser?.avatarID ??
        currentUser?.avatarId ??
        currentUser?.avatar ??
        null;

      const requestData: CreateVacationDTO = {
        userId: user.id,
        userName: user.name,
        userAvatarId: safeUserAvatarId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        observation: observation.trim(),
      };

      await vacationService.createRequest(requestData);

      setDialog({
        visible: true,
        title: "Tudo certo! 🌴",
        message: "Sua solicitação foi enviada para o gestor com sucesso.",
        variant: "success",
        onConfirm: () => {
          closeDialog();
          navigation.goBack();
        },
      });
    } catch (error: any) {
      setDialog({
        visible: true,
        title: "Ops, algo deu errado",
        message: error?.message || "Não foi possível criar a solicitação.",
        variant: "error",
        onConfirm: closeDialog,
      });
    } finally {
      setLoading(false);
    }
  };

  const onStartChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate >= endDate) {
        setEndDate(addDays(selectedDate, 15));
      }
    }
  };

  const onEndChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark relative">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View className="pt-12 px-6 pb-4 bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-100 dark:border-gray-800 z-10 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800"
        >
          <Feather
            name="arrow-left"
            size={24}
            color={isDark ? "#F3F4F6" : "#374151"}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
          Agendar Férias
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Informe o período desejado. O sistema notificará seu gestor
          automaticamente.
        </Text>

        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-700 dark:text-gray-200 font-bold text-base">
              Período
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${
                duration > 0
                  ? isDark
                    ? "bg-blue-900/30"
                    : "bg-blue-50"
                  : isDark
                  ? "bg-rose-900/30"
                  : "bg-rose-50"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  duration > 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {duration > 0
                  ? `${duration} dias selecionados`
                  : "Datas inválidas"}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-x-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-bold mb-2 uppercase">
                Início
              </Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-background-light dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-gray-700 flex-row items-center"
              >
                <Feather
                  name="calendar"
                  size={18}
                  color={isDark ? "#93C5FD" : "#6B7280"}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-gray-800 dark:text-gray-100 font-medium text-sm">
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-bold mb-2 uppercase">
                Fim
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className={`bg-background-light dark:bg-background-dark p-3 rounded-xl border flex-row items-center ${
                  duration <= 0
                    ? isDark
                      ? "border-rose-800 bg-rose-900/10"
                      : "border-rose-300 bg-rose-50"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Feather
                  name="calendar"
                  size={18}
                  color={
                    duration <= 0 ? "#E11D48" : isDark ? "#93C5FD" : "#6B7280"
                  }
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`font-medium text-sm ${
                    duration <= 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 dark:text-gray-200 font-bold mb-2 ml-1">
            Observação (Opcional)
          </Text>
          <TextInput
            className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-gray-700 h-32 text-gray-700 dark:text-gray-200 shadow-sm"
            placeholder="Ex: Gostaria de emendar com o feriado..."
            placeholderTextColor={isDark ? "#4B5563" : "#9CA3AF"}
            multiline
            textAlignVertical="top"
            value={observation}
            onChangeText={setObservation}
          />
        </View>

        <Button
          title="Confirmar Solicitação"
          variant="success"
          onPress={handleCreate}
          isLoading={loading}
          disabled={duration <= 0}
        />
      </ScrollView>

      <View
        className="absolute bottom-[-20] right-[-30] opacity-5 z-0"
        pointerEvents="none"
      >
        <Feather
          name="calendar"
          size={180}
          color={isDark ? "#FFF" : "#000"}
          style={{ transform: [{ rotate: "-15deg" }] }}
        />
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onStartChange}
          minimumDate={new Date()}
          textColor={isDark ? "#FFFFFF" : "#000000"}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onEndChange}
          minimumDate={addDays(startDate, 1)}
          textColor={isDark ? "#FFFFFF" : "#000000"}
        />
      )}

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={dialog.onConfirm}
      />
    </View>
  );
}
