import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";

interface VacationCardProps {
  item: {
    userName: string;
    startDate: string;
    endDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    observation?: string;
    managerObservation?: string;
  };
}

export function VacationCard({ item }: VacationCardProps) {
  const statusConfig = {
    PENDING: {
      label: "Pendente",
      bg: "bg-amber-100",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    APPROVED: {
      label: "Aprovado",
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    REJECTED: {
      label: "Reprovado",
      bg: "bg-rose-100",
      text: "text-rose-700",
      border: "border-rose-200",
    },
  };

  const theme = statusConfig[item.status] || statusConfig.PENDING;

  return (
    <View className="bg-surface p-5 rounded-2xl mb-4 border border-gray-100 shadow-sm">
      {/* Cabeçalho do Card: Nome e Badge de Status */}
      <View className="flex-row justify-between items-start mb-3">
        <Text
          className="font-bold text-secondary text-lg flex-1 mr-2"
          numberOfLines={1}
        >
          {item.userName}
        </Text>

        <View
          className={`px-3 py-1 rounded-full border ${theme.bg} ${theme.border}`}
        >
          <Text className={`text-xs font-bold ${theme.text}`}>
            {theme.label}
          </Text>
        </View>
      </View>

      {/* Datas */}
      <View className="flex-row items-center mb-2">
        <Text className="text-2xl mr-2">🗓️</Text>
        <Text className="text-gray-600 font-medium">
          {format(new Date(item.startDate), "dd/MM/yy")}{" "}
          <Text className="text-gray-400">até</Text>{" "}
          {format(new Date(item.endDate), "dd/MM/yy")}
        </Text>
      </View>

      {/* Observação do Colaborador */}
      {item.observation && (
        <View className="mt-2 bg-gray-50 p-2 rounded-lg">
          <Text className="text-gray-500 text-xs italic">
            Obs: "{item.observation}"
          </Text>
        </View>
      )}

      {/* Observação do Gestor (Se houver) */}
      {item.managerObservation && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-gray-400 text-xs font-bold mb-1">
            Resposta do Gestor:
          </Text>
          <Text className="text-gray-600 text-sm">
            "{item.managerObservation}"
          </Text>
        </View>
      )}
    </View>
  );
}
