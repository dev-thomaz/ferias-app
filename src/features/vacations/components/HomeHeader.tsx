import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import {
  Briefcase,
  User as UserIcon,
  Sun,
  Moon,
  LogOut,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { User } from "@/types";

interface HomeHeaderProps {
  user: User;
  onLogout: () => void;
}

export function HomeHeader({ user, onLogout }: HomeHeaderProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const isManager = user.role === "GESTOR";

  return (
    <View className="flex-row justify-between items-center mb-6 mt-2 px-6 pt-4">
      <View className="flex-row items-center flex-1">
        <View className="bg-surface-light dark:bg-surface-dark p-1 rounded-full shadow-sm mr-4 border border-gray-100 dark:border-gray-800">
          <Avatar name={user.name} avatarId={user.avatarID} size="lg" />
        </View>

        <View className="flex-1">
          <View
            className={`self-start px-3 py-1 rounded-md mb-1.5 flex-row items-center ${
              isManager
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-emerald-100 dark:bg-emerald-900/30"
            }`}
          >
            {isManager ? (
              <Briefcase
                size={12}
                color={
                  isManager
                    ? isDark
                      ? "#60A5FA"
                      : "#1D4ED8"
                    : isDark
                    ? "#34D399"
                    : "#047857"
                }
                style={{ marginRight: 6 }}
              />
            ) : (
              <UserIcon
                size={12}
                color={
                  isManager
                    ? isDark
                      ? "#60A5FA"
                      : "#1D4ED8"
                    : isDark
                    ? "#34D399"
                    : "#047857"
                }
                style={{ marginRight: 6 }}
              />
            )}

            <Text
              className={`text-xs font-bold uppercase tracking-wide ${
                isManager
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-emerald-700 dark:text-emerald-400"
              }`}
            >
              {isManager ? "Gestor" : "Colaborador"}
            </Text>
          </View>

          <Text className="text-gray-400 font-medium text-sm">
            Bem-vindo(a),
          </Text>
          <Text
            className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight"
            numberOfLines={1}
          >
            {formatShortName(user.name)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-x-2">
        <TouchableOpacity
          onPress={toggleColorScheme}
          className="bg-surface-light dark:bg-surface-dark p-3.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          {isDark ? (
            <Sun size={22} color="#FBBF24" />
          ) : (
            <Moon size={22} color={isManager ? "#1D4ED8" : "#6B7280"} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogout}
          className="bg-surface-light dark:bg-surface-dark p-3.5 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <LogOut size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
