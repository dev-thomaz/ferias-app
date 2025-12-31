import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";

import { Button } from "@/components/Button";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { vacationService } from "../services/vacationService";
import { vacationSchema, VacationFormData } from "../schemas/vacationSchema";

export function NewVacationScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VacationFormData>({
    resolver: zodResolver(vacationSchema),
    defaultValues: { startDate: "", endDate: "", observation: "" },
  });

  const onSubmit = async (data: VacationFormData) => {
    if (!user) return Alert.alert("Erro", "Usuário não autenticado");

    try {
      await vacationService.createRequest({
        userId: user.id,
        userName: user.name,
        startDate: data.startDate,
        endDate: data.endDate,
        observation: data.observation,
      });

      Alert.alert("Sucesso", "Solicitação enviada!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar solicitação no Firebase.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold text-secondary mt-10 mb-6">
        Solicitar Férias
      </Text>

      <View className="gap-y-4">
        {/* Campo Data de Início */}
        <View>
          <Text className="text-secondary font-medium mb-1">
            Data de Início
          </Text>
          <Controller
            control={control}
            name="startDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  className={`bg-surface p-4 rounded-xl border ${
                    errors.startDate ? "border-danger" : "border-gray-200"
                  }`}
                >
                  <Text className={value ? "text-secondary" : "text-gray-400"}>
                    {value
                      ? format(new Date(value), "dd/MM/yyyy")
                      : "Selecione a data"}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={new Date()}
                    onChange={(_, date) => {
                      setShowStartPicker(false);
                      if (date) onChange(date.toISOString());
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.startDate && (
            <Text className="text-danger text-xs mt-1">
              {errors.startDate.message}
            </Text>
          )}
        </View>

        {/* Campo Data de Término */}
        <View>
          <Text className="text-secondary font-medium mb-1">
            Data de Término
          </Text>
          <Controller
            control={control}
            name="endDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className={`bg-surface p-4 rounded-xl border ${
                    errors.endDate ? "border-danger" : "border-gray-200"
                  }`}
                >
                  <Text className={value ? "text-secondary" : "text-gray-400"}>
                    {value
                      ? format(new Date(value), "dd/MM/yyyy")
                      : "Selecione a data"}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={value ? new Date(value) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    minimumDate={new Date()}
                    onChange={(_, date) => {
                      setShowEndPicker(false);
                      if (date) onChange(date.toISOString());
                    }}
                  />
                )}
              </>
            )}
          />
          {errors.endDate && (
            <Text className="text-danger text-xs mt-1">
              {errors.endDate.message}
            </Text>
          )}
        </View>
      </View>

      <View className="mt-10">
        <Button
          title="Enviar Solicitação"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
