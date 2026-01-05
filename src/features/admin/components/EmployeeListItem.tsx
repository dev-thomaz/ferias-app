import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Key, Mail, UserCheck, UserX, Zap } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { User } from "@/types";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";

interface EmployeeListItemProps {
  item: User;
  onStatusPress: (user: User) => void;
  onResetPress: (user: User) => void;
}

export function EmployeeListItem({
  item,
  onStatusPress,
  onResetPress,
}: EmployeeListItemProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const isActive = item.accountStatus === "ACTIVE";
  const isSyncing = item.isSyncing;

  return (
    <View
      className={`bg-surface-light dark:bg-surface-dark rounded-3xl mb-4 shadow-sm border ${
        isActive
          ? isSyncing
            ? "border-blue-400"
            : "border-gray-100 dark:border-gray-800"
          : "border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark/30"
      }`}
    >
      <View className="p-4 flex-row items-center">
        <View style={{ opacity: isActive ? 1 : 0.5 }}>
          <Avatar name={item.name} avatarId={item.avatarID} size="md" />
        </View>
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Text
              className={`font-bold text-base ${
                isActive
                  ? "text-gray-800 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {formatShortName(item.name)}
            </Text>

            {isSyncing ? (
              <View className="ml-2 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex-row items-center">
                <Zap size={8} color="#3b82f6" />
                <Text className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase ml-1">
                  Sinc.
                </Text>
              </View>
            ) : (
              !isActive && (
                <View className="ml-2 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                  <Text className="text-[8px] font-black text-gray-500 dark:text-gray-300 uppercase">
                    Inativo
                  </Text>
                </View>
              )
            )}
          </View>
          <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            {item.role}
          </Text>
        </View>

        <View className="flex-row gap-x-2">
          <TouchableOpacity
            onPress={() => onResetPress(item)}
            className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full items-center justify-center border border-amber-100 dark:border-amber-900/30"
          >
            <Key size={16} color={isDark ? "#fbbf24" : "#d97706"} />
          </TouchableOpacity>

          {item.role !== "ADMIN" && (
            <TouchableOpacity
              onPress={() => onStatusPress(item)}
              className={`w-10 h-10 rounded-full items-center justify-center border ${
                isActive
                  ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
                  : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30"
              }`}
            >
              {isActive ? (
                <UserX size={16} color={isDark ? "#fb7185" : "#ef4444"} />
              ) : (
                <UserCheck size={16} color={isDark ? "#34d399" : "#10b981"} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="px-4 pb-3 flex-row items-center">
        <Mail size={10} color={isDark ? "#4B5563" : "#9CA3AF"} />
        <Text className="text-gray-400 dark:text-gray-500 text-[10px] ml-1">
          {item.email}
        </Text>
      </View>
    </View>
  );
}
