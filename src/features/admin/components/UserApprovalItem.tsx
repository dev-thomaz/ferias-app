import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { XCircle, CheckCircle } from "lucide-react-native";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useColorScheme } from "nativewind";

import { PendingUser } from "@/features/admin/services/adminService";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";

interface UserApprovalItemProps {
  item: PendingUser;
  isProcessing: boolean;
  onApprove: (user: PendingUser) => void;
  onReject: (user: PendingUser) => void;
}

export function UserApprovalItem({
  item,
  isProcessing,
  onApprove,
  onReject,
}: UserApprovalItemProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const roleColors = {
    GESTOR: {
      bg: isDark ? "bg-blue-900/30" : "bg-blue-100",
      text: isDark ? "text-blue-400" : "text-blue-700",
      border: isDark ? "border-blue-800/50" : "border-blue-200",
    },
    ADMIN: {
      bg: isDark ? "bg-purple-900/30" : "bg-purple-100",
      text: isDark ? "text-purple-400" : "text-purple-700",
      border: isDark ? "border-purple-800/50" : "border-purple-200",
    },
    COLABORADOR: {
      bg: isDark ? "bg-emerald-900/30" : "bg-emerald-100",
      text: isDark ? "text-emerald-400" : "text-emerald-700",
      border: isDark ? "border-emerald-800/50" : "border-emerald-200",
    },
  };

  const roleStyle =
    roleColors[item.role as keyof typeof roleColors] || roleColors.COLABORADOR;

  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-3xl mb-4 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <View className="p-5 flex-row items-start">
        <Avatar name={item.name} avatarId={item.avatarID} size="md" />

        <View className="ml-4 flex-1">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight mb-1">
                {formatShortName(item.name)}
              </Text>
              <View
                className={`self-start px-2 py-0.5 rounded-md ${roleStyle.bg} border ${roleStyle.border}`}
              >
                <Text
                  className={`text-[10px] font-bold uppercase ${roleStyle.text}`}
                >
                  {item.role}
                </Text>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                Aguardando há
              </Text>
              <Text className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                {formatDistanceToNow(parseISO(item.createdAt), {
                  locale: ptBR,
                }).replace("cerca de ", "")}
              </Text>
            </View>
          </View>

          <Text
            className="text-gray-500 dark:text-gray-400 text-sm mt-2"
            numberOfLines={1}
          >
            {item.email}
          </Text>
        </View>
      </View>

      <View className="flex-row border-t border-gray-100 dark:border-gray-800">
        <TouchableOpacity
          disabled={isProcessing}
          onPress={() => onReject(item)}
          className="flex-1 py-4 bg-background-light dark:bg-background-dark active:opacity-70 items-center flex-row justify-center border-r border-gray-100 dark:border-gray-800"
        >
          <XCircle size={18} color="#EF4444" />
          <Text className="ml-2 font-bold text-gray-600 dark:text-gray-400">
            Rejeitar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isProcessing}
          onPress={() => onApprove(item)}
          className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-900/20 active:opacity-70 items-center flex-row justify-center"
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#059669" />
          ) : (
            <>
              <CheckCircle size={18} color={isDark ? "#34d399" : "#059669"} />
              <Text
                className={`ml-2 font-bold ${
                  isDark ? "text-emerald-400" : "text-emerald-700"
                }`}
              >
                Aprovar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
