import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "@/components/Button";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (observation: string) => void;
  action: "APPROVE" | "REJECT";
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

  const isApprove = action === "APPROVE";

  const colorText = isApprove ? "text-emerald-700" : "text-rose-700";
  const title = isApprove ? "Aprovar Férias" : "Reprovar Férias";
  const btnVariant = isApprove ? "success" : "danger";

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
        <View className="bg-background w-full rounded-3xl p-6 shadow-xl">
          <Text className={`text-2xl font-bold mb-2 text-center ${colorText}`}>
            {title}
          </Text>

          <Text className="text-gray-500 mb-6 text-center">
            Deseja adicionar uma observação para o colaborador?
          </Text>

          <TextInput
            className="bg-surface p-4 rounded-xl border border-gray-200 h-28 mb-6 text-secondary"
            placeholder="Ex: Bom descanso! ou Precisamos conversar sobre as datas..."
            multiline
            textAlignVertical="top"
            value={observation}
            onChangeText={setObservation}
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
