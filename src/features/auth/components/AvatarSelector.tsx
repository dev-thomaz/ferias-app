import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  LayoutAnimation,
} from "react-native";

import { Smile, User } from "lucide-react-native";

interface AvatarSelectorProps {
  useAvatar: boolean;
  onToggleAvatar: (value: boolean) => void;
  gender: "M" | "F";
  onSelectGender: (gender: "M" | "F") => void;
}

export function AvatarSelector({
  useAvatar,
  onToggleAvatar,
  gender,
  onSelectGender,
}: AvatarSelectorProps) {
  return (
    <View className="mb-2 bg-background-light dark:bg-background-dark p-3 rounded-xl border border-gray-100 dark:border-gray-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Smile size={18} color="#9CA3AF" />
          <Text className="text-gray-600 dark:text-gray-400 font-medium ml-2">
            Usar avatar personalizado?
          </Text>
        </View>
        <Switch
          value={useAvatar}
          onValueChange={(val) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            onToggleAvatar(val);
          }}
          trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
          thumbColor={useAvatar ? "#2563EB" : "#F3F4F6"}
        />
      </View>

      {useAvatar && (
        <View className="mt-3 flex-row gap-3">
          {(["M", "F"] as const).map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => onSelectGender(g)}
              className={`flex-1 py-2 rounded-lg border flex-row items-center justify-center ${
                gender === g
                  ? g === "M"
                    ? "bg-blue-100 border-blue-200"
                    : "bg-pink-100 border-pink-200"
                  : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-700"
              }`}
            >
              <User
                size={16}
                color={
                  gender === g ? (g === "M" ? "#1D4ED8" : "#BE185D") : "#9CA3AF"
                }
              />
              <Text
                className={`ml-2 text-xs font-bold ${
                  gender === g
                    ? g === "M"
                      ? "text-blue-700"
                      : "text-pink-700"
                    : "text-gray-500"
                }`}
              >
                {g === "M" ? "Masculino" : "Feminino"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
