import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDays, format } from "date-fns";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { vacationService } from "../services/vacationService";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/dateUtils";

export function NewVacationScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleCreate = async () => {
    if (!user) return;

    if (startDate >= endDate) {
      Alert.alert("Erro", "A data final deve ser maior que a data inicial.");
      return;
    }

    setLoading(true);
    try {
      await vacationService.createRequest({
        userId: user.id,
        userName: user.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        observation,
        managerObservation: "",
      });

      Alert.alert("Sucesso", "Solicitação enviada para aprovação!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a solicitação.");
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
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 40 }}>
        <Text className="text-2xl font-bold text-secondary mb-2">
          Nova Solicitação
        </Text>
        <Text className="text-gray-500 mb-8">
          Preencha os dados abaixo para solicitar suas férias.
        </Text>

        <View className="mb-6">
          <Text className="text-secondary font-bold mb-2">
            Início das Férias
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="bg-surface p-4 rounded-xl border border-gray-200"
          >
            <Text className="text-secondary text-lg">
              {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-secondary font-bold mb-2">Fim das Férias</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="bg-surface p-4 rounded-xl border border-gray-200"
          >
            <Text className="text-secondary text-lg">
              {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <Text className="text-secondary font-bold mb-2">Observação</Text>
          <TextInput
            className="bg-surface p-4 rounded-xl border border-gray-200 h-32 text-secondary"
            placeholder="Ex: Gostaria de emendar com o feriado..."
            multiline
            textAlignVertical="top"
            value={observation}
            onChangeText={setObservation}
          />
        </View>

        <Button
          title="Enviar Solicitação"
          onPress={handleCreate}
          isLoading={loading}
        />

        <TouchableOpacity
          className="mt-4 py-4"
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text className="text-center text-gray-500 font-bold">Cancelar</Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onStartChange}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onEndChange}
            minimumDate={addDays(startDate, 1)}
          />
        )}
      </ScrollView>
    </View>
  );
}
