import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, ButtonVariant } from "@/components/Button";

export type ActionType = "APPROVE" | "REJECT";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (observation: string) => void;
  action: ActionType;
  isLoading?: boolean;
}

export function ActionModal({
  visible,
  onClose,
  onConfirm,
  action,
  isLoading,
}: ActionModalProps) {
  const [observation, setObservation] = useState("");

  useEffect(() => {
    if (visible) {
      setObservation("");
    }
  }, [visible]);

  const isApprove = action === "APPROVE";

  const title = isApprove ? "Aprovar Férias" : "Reprovar Férias";
  const colorText = isApprove ? "text-emerald-700" : "text-rose-700";
  const btnVariant: ButtonVariant = isApprove ? "success" : "danger";

  const description = isApprove
    ? "Deseja confirmar a aprovação desta solicitação?"
    : "Informe o motivo da reprovação.";

  const label = isApprove ? "Observação (Opcional)" : "Motivo (Opcional)";

  const placeholder = isApprove
    ? "Ex: Bom descanso!..."
    : "Ex: O período coincide com a entrega do projeto...";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black/60 justify-center items-center p-6"
      >
        <View className="bg-white w-full rounded-3xl p-6 shadow-xl">
          <Text className={`text-2xl font-bold mb-2 text-center ${colorText}`}>
            {title}
          </Text>

          <Text className="text-gray-500 mb-6 text-center">{description}</Text>

          <Text className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">
            {label}
          </Text>

          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-200 h-28 mb-6 text-gray-800"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={observation}
            onChangeText={setObservation}
            autoFocus={false}
          />

          <View className="gap-y-3">
            <Button
              title={`Confirmar ${isApprove ? "Aprovação" : "Reprovação"}`}
              variant={btnVariant}
              onPress={() => onConfirm(observation)}
              isLoading={isLoading}
            />

            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="py-3"
            >
              <Text className="text-center text-gray-400 font-bold">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
