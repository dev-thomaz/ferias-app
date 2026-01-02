import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "./Button";
import { useColorScheme } from "nativewind";

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const variants = {
    success: {
      icon: "check-circle",
      color: "text-emerald-600",
      btnVariant: "success",
      iconColor: isDark ? "#10b981" : "#059669",
    },
    error: {
      icon: "alert-circle",
      color: "text-rose-600",
      btnVariant: "danger",
      iconColor: isDark ? "#fb7185" : "#e11d48",
    },
    warning: {
      icon: "alert-triangle",
      color: "text-amber-600",
      btnVariant: "primary",
      iconColor: isDark ? "#fbbf24" : "#d97706",
    },
    info: {
      icon: "info",
      color: "text-blue-600",
      btnVariant: "primary",
      iconColor: isDark ? "#60a5fa" : "#2563eb",
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
      <View className="flex-1 bg-black/70 justify-center items-center p-6">
        <View className="bg-surface-light dark:bg-surface-dark w-full rounded-3xl p-8 shadow-2xl items-center border border-transparent dark:border-gray-800">
          <View className="mb-6 p-5 rounded-full bg-background-light dark:bg-background-dark/50">
            <Feather
              name={theme.icon as any}
              size={36}
              color={theme.iconColor}
            />
          </View>

          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-3">
            {title}
          </Text>

          <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 leading-relaxed text-base">
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
                className="py-3 active:opacity-60"
              >
                <Text className="text-center text-gray-400 dark:text-gray-500 font-bold">
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
