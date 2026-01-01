import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "./Button";

export type DialogVariant = "success" | "error" | "info" | "warning";

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  variant?: DialogVariant;
  confirmText?: string;
  onConfirm: () => void;

  onCancel?: () => void;
  cancelText?: string;
}

export function Dialog({
  visible,
  title,
  message,
  variant = "info",
  confirmText = "Entendido",
  onConfirm,
  onCancel,
  cancelText = "Cancelar",
}: DialogProps) {
  const variants = {
    success: {
      icon: "check-circle",
      color: "text-emerald-600",
      btnVariant: "success",
      iconColor: "#059669",
    },
    error: {
      icon: "alert-circle",
      color: "text-rose-600",
      btnVariant: "danger",
      iconColor: "#e11d48",
    },
    warning: {
      icon: "alert-triangle",
      color: "text-amber-600",
      btnVariant: "primary",
      iconColor: "#d97706",
    },
    info: {
      icon: "info",
      color: "text-blue-600",
      btnVariant: "primary",
      iconColor: "#2563eb",
    },
  } as const;

  const theme = variants[variant];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View className="bg-white w-full rounded-3xl p-6 shadow-xl items-center">
          <View className={`mb-4 p-4 rounded-full bg-gray-50`}>
            <Feather
              name={theme.icon as any}
              size={32}
              color={theme.iconColor}
            />
          </View>

          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            {title}
          </Text>

          <Text className="text-gray-500 text-center mb-8 leading-relaxed">
            {message}
          </Text>

          <View className="w-full gap-y-3">
            <Button
              title={confirmText}
              variant={theme.btnVariant as any}
              onPress={onConfirm}
            />

            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="py-3 active:opacity-70"
              >
                <Text className="text-center text-gray-400 font-bold">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
