import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays } from "date-fns";

import { ArrowLeft, Calendar } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/dateUtils";
import { Dialog } from "@/components/Dialog";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useNewVacation } from "../hooks/useNewVacation";

export function NewVacationScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    observation,
    setObservation,
    loading,
    duration,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    dialog,
    handleCreate,
  } = useNewVacation(user);

  return (
    <ScreenWrapper>
      <View className="pt-12 px-6 pb-4 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
        >
          <ArrowLeft size={24} color={isDark ? "#F3F4F6" : "#374151"} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
          Agendar Férias
        </Text>
      </View>

      <View className="p-6">
        <Text className="text-gray-500 dark:text-gray-400 mb-8">
          Informe o período desejado. O sistema notificará seu gestor
          automaticamente.
        </Text>

        <View className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 shadow-sm">
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-700 dark:text-gray-200 font-bold">
              Período
            </Text>
            <Text
              className={`text-xs font-bold ${
                duration > 0 ? "text-blue-500" : "text-rose-500"
              }`}
            >
              {duration > 0
                ? `${duration} dias selecionados`
                : "Datas inválidas"}
            </Text>
          </View>

          <View className="flex-row gap-x-4">
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="flex-1 bg-background-light dark:bg-background-dark p-3 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Início
              </Text>
              <View className="flex-row items-center">
                <Calendar
                  size={16}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-gray-800 dark:text-gray-100 font-medium">
                  {formatDate(startDate)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className={`flex-1 p-3 rounded-xl border ${
                duration <= 0
                  ? "border-rose-300 bg-rose-50 dark:bg-rose-900/10"
                  : "border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark"
              }`}
            >
              <Text className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Fim
              </Text>
              <View className="flex-row items-center">
                <Calendar
                  size={16}
                  color={duration <= 0 ? "#E11D48" : "#6B7280"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={`font-medium ${
                    duration <= 0
                      ? "text-rose-600"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {formatDate(endDate)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-gray-700 dark:text-gray-200 font-bold mb-2 ml-1">
            Observação (Opcional)
          </Text>
          <TextInput
            className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-gray-700 h-32 text-gray-700 dark:text-gray-200 shadow-sm"
            placeholder="Ex: Gostaria de emendar com o feriado..."
            placeholderTextColor="#9CA3AF"
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
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={(e, date) => {
            setShowStartPicker(false);
            if (date) {
              setStartDate(date);
              if (date >= endDate) setEndDate(addDays(date, 15));
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={addDays(startDate, 1)}
          onChange={(e, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <Dialog {...dialog} />
    </ScreenWrapper>
  );
}
