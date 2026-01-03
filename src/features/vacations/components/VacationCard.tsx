import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  CloudOff,
  Zap,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { VacationRequest } from "../types";
import { formatDate } from "@/utils/dateUtils";
import { formatShortName } from "@/utils/textUtils";

interface VacationCardProps {
  item: VacationRequest;
  onPress: () => void;
}

export function VacationCard({ item, onPress }: VacationCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const statusConfig = {
    PENDING: {
      label: "Pendente",
      bg: isDark ? "bg-amber-900/20" : "bg-amber-100",
      text: isDark ? "text-amber-400" : "text-amber-700",
      border: isDark ? "border-amber-900/30" : "border-amber-200",
      iconColor: isDark ? "#fbbf24" : "#B45309",
    },
    APPROVED: {
      label: "Aprovado",
      bg: isDark ? "bg-emerald-900/20" : "bg-emerald-100",
      text: isDark ? "text-emerald-400" : "text-emerald-700",
      border: isDark ? "border-emerald-900/30" : "border-emerald-200",
      iconColor: isDark ? "#34d399" : "#047857",
    },
    COMPLETED: {
      label: "Concluído",
      bg: isDark ? "bg-blue-900/20" : "bg-blue-100",
      text: isDark ? "text-blue-400" : "text-blue-700",
      border: isDark ? "border-blue-900/30" : "border-blue-200",
      iconColor: isDark ? "#60a5fa" : "#1D4ED8",
    },
    REJECTED: {
      label: "Reprovado",
      bg: isDark ? "bg-rose-900/20" : "bg-rose-100",
      text: isDark ? "text-rose-400" : "text-rose-700",
      border: isDark ? "border-rose-900/30" : "border-rose-200",
      iconColor: isDark ? "#fb7185" : "#BE123C",
    },
  };

  const theme = (statusConfig as any)[item.status] || statusConfig.PENDING;
  const isPending = item.status === "PENDING";
  const isSyncing = item.isSyncing; //

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`bg-surface-light dark:bg-surface-dark p-5 rounded-3xl mb-4 border relative overflow-hidden ${
        isSyncing
          ? "border-blue-500 shadow-xl shadow-blue-500/40"
          : "border-gray-100 dark:border-gray-800 shadow-sm"
      }`}
    >
      {isSyncing && (
        <View className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500" />
      )}

      <View className="flex-row justify-between items-start mb-4">
        <Text
          className="font-bold text-gray-800 dark:text-gray-100 text-lg flex-1 mr-2"
          numberOfLines={1}
        >
          {formatShortName(item.userName)}
        </Text>
        <View
          className={`px-3 py-1 rounded-full border ${theme.bg} ${theme.border}`}
        >
          <Text
            className={`text-[10px] font-black uppercase tracking-wider ${theme.text}`}
          >
            {theme.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <View className="bg-background-light dark:bg-background-dark p-2.5 rounded-xl mr-3 border border-gray-50 dark:border-gray-800">
          <Calendar size={18} color={isDark ? "#93C5FD" : "#6B7280"} />
        </View>
        <View className="flex-1 justify-center">
          <Text
            className="text-gray-600 dark:text-gray-300 font-bold text-base leading-7 py-1"
            style={{ includeFontPadding: false, textAlignVertical: "center" }}
          >
            {formatDate(item.startDate)}{" "}
            <Text className="text-gray-400 dark:text-gray-500 font-normal text-xs italic">
              até
            </Text>{" "}
            {formatDate(item.endDate)}
          </Text>
        </View>
      </View>

      {item.observation ? (
        <View className="mb-4 bg-gray-50 dark:bg-background-dark/30 p-3 rounded-xl border-l-4 border-gray-200 dark:border-gray-700">
          <Text
            className="text-gray-500 dark:text-gray-400 text-xs italic leading-5"
            numberOfLines={2}
          >
            "{item.observation}"
          </Text>
        </View>
      ) : null}

      <View className="flex-row justify-between items-center mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <View className="flex-1 mr-4">
          {isSyncing ? (
            <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg self-start">
              <Zap size={12} color="#3b82f6" fill="#3b82f6" />
              <Text className="text-blue-600 dark:text-blue-400 text-[9px] ml-1 uppercase font-black tracking-widest">
                Dispositivo (Offline)
              </Text>
            </View>
          ) : (
            <>
              <View className="flex-row items-center mb-1">
                <Clock size={10} color={isDark ? "#6B7280" : "#9CA3AF"} />
                <Text className="text-gray-400 dark:text-gray-500 text-[10px] ml-1 uppercase font-medium">
                  Criado: {formatDate(item.createdAt, "dd/MM HH:mm")}
                </Text>
              </View>

              {!isPending && item.updatedAt && (
                <View className="flex-row items-center">
                  <CheckCircle
                    size={10}
                    color={
                      item.status === "APPROVED" || item.status === "COMPLETED"
                        ? "#10b981"
                        : "#ef4444"
                    }
                  />
                  <Text className="text-gray-400 dark:text-gray-500 text-[10px] ml-1 uppercase font-medium">
                    Análise: {formatDate(item.updatedAt, "dd/MM HH:mm")}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <View className="flex-row items-center">
          {isSyncing && (
            <CloudOff size={14} color="#3b82f6" style={{ marginRight: 8 }} />
          )}
          <Text
            className={`text-xs font-black uppercase tracking-tighter mr-1 ${theme.text}`}
          >
            Detalhes
          </Text>
          <ChevronRight size={16} color={theme.iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
