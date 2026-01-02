import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserRole } from "../store/useAuthStore";

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  const roles: UserRole[] = ["COLABORADOR", "GESTOR", "ADMIN"];

  const getActiveColor = (role: UserRole) => {
    if (role === "ADMIN") return "bg-purple-600 border-purple-600";
    if (role === "GESTOR") return "bg-blue-600 border-blue-600";
    return "bg-emerald-600 border-emerald-600";
  };

  return (
    <View className="mb-4">
      <Text className="text-gray-500 dark:text-gray-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">
        Eu sou:
      </Text>
      <View className="flex-row gap-3">
        {roles.map((r) => {
          const isSelected = selectedRole === r;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => onSelect(r)}
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                isSelected
                  ? getActiveColor(r)
                  : "bg-background-light dark:bg-background-dark border-gray-200"
              }`}
            >
              <Text
                className={`text-[10px] font-bold uppercase ${
                  isSelected ? "text-white" : "text-gray-400"
                }`}
              >
                {r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
