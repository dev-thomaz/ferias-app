import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

import { VacationRequest } from "../types";
import { formatDate } from "@/utils/dateUtils";
import { formatShortName } from "@/utils/textUtils";

interface VacationCardProps {
  item: VacationRequest;
  onPress: () => void;
}

export function VacationCard({ item, onPress }: VacationCardProps) {
  const statusConfig = {
    PENDING: {
      label: "Pendente",
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
      iconColor: "#B45309",
    },
    APPROVED: {
      label: "Aprovado",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
      iconColor: "#047857",
    },
    REJECTED: {
      label: "Reprovado",
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
      iconColor: "#BE123C",
    },
  };

  const theme = statusConfig[item.status] || statusConfig.PENDING;
  const isPending = item.status === "PENDING";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-3">
        <Text
          className="font-bold text-secondary text-lg flex-1 mr-2"
          numberOfLines={1}
        >
          {formatShortName(item.userName)}
        </Text>

        <View
          className={`px-3 py-1 rounded-full border ${theme.bg} ${theme.border}`}
        >
          <Text className={`text-xs font-bold ${theme.text}`}>
            {theme.label}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <View className="bg-gray-50 p-2 rounded-lg mr-3">
          <Feather name="calendar" size={18} color="#6B7280" />
        </View>
        <Text className="text-gray-600 font-medium text-base">
          {formatDate(item.startDate)}{" "}
          <Text className="text-gray-400 text-xs">até</Text>{" "}
          {formatDate(item.endDate)}
        </Text>
      </View>

      {item.observation && (
        <View className="mb-3">
          <Text
            className="text-gray-500 text-sm italic leading-5"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            "{item.observation}"
          </Text>
        </View>
      )}

      <View className="flex-row justify-between items-end mt-2 pt-3 border-t border-gray-100">
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-1">
            <Feather name="clock" size={10} color="#9CA3AF" />
            <Text className="text-gray-400 text-[10px] ml-1">
              Solicitado: {formatDate(item.createdAt, "dd/MM 'às' HH:mm")}
            </Text>
          </View>

          {!isPending && item.updatedAt && (
            <View className="flex-row items-center">
              <Feather
                name="check-circle"
                size={10}
                color={item.status === "APPROVED" ? "#059669" : "#E11D48"}
              />
              <Text className="text-gray-400 text-[10px] ml-1">
                Respondido: {formatDate(item.updatedAt, "dd/MM 'às' HH:mm")}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center mb-0.5">
          <Text className={`text-xs font-bold mr-1 ${theme.text}`}>
            Ver detalhes
          </Text>
          <Feather name="chevron-right" size={16} color={theme.iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
