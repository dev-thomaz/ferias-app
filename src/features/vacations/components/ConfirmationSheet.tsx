import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface ConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "APPROVE" | "REJECT";
}

export function ConfirmationSheet({
  visible,
  onClose,
  onConfirm,
  action,
}: ConfirmationSheetProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(300);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 12,
      }).start();
    }
  }, [visible]);

  const isApprove = action === "APPROVE";
  const title = isApprove ? "Confirmar Aprovação?" : "Confirmar Reprovação?";
  const colorClass = isApprove ? "text-emerald-600" : "text-rose-600";
  const bgButtonClass = isApprove ? "bg-emerald-600" : "bg-rose-600";
  const shadowClass = isApprove ? "shadow-emerald-200" : "shadow-rose-200";
  const icon = isApprove ? "check-circle" : "x-circle";

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/60 justify-end">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }] }}
              className="bg-surface-light dark:bg-surface-dark rounded-t-3xl p-6 pb-10 shadow-2xl"
            >
              <View className="items-center mb-6">
                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
              </View>

              <View className="items-center mb-6">
                <View
                  className={`p-4 rounded-full mb-4 ${
                    isApprove ? "bg-emerald-100" : "bg-rose-100"
                  }`}
                >
                  <Feather
                    name={icon}
                    size={40}
                    color={isApprove ? "#059669" : "#E11D48"}
                  />
                </View>
                <Text className={`text-2xl font-bold ${colorClass} mb-2`}>
                  {title}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center px-4 leading-6">
                  Essa ação notificará o colaborador imediatamente e{" "}
                  <Text className="font-bold text-gray-700">
                    não poderá ser desfeita
                  </Text>
                  .
                </Text>
              </View>

              <View className="gap-y-3">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onConfirm}
                  className={`${bgButtonClass} p-4 rounded-xl flex-row justify-center items-center shadow-lg ${shadowClass}`}
                >
                  <Text className="text-white font-bold text-lg">
                    Sim, confirmar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onClose}
                  className="p-4 rounded-xl items-center"
                >
                  <Text className="text-gray-500 dark:text-gray-400 font-bold text-base">
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
