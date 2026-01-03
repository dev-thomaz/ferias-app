import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import {
  Clock,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Calendar,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { VacationRequest } from "../../types";
import { formatShortName } from "@/utils/textUtils";
import { Avatar } from "@/components/Avatar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { useVacationDetailsBase } from "../../hooks/useVacationDetailsBase";

export function AdminView({ request }: { request: VacationRequest }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { isExpanded, duration, formattedDates, status, toggleAccordion } =
    useVacationDetailsBase(request);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex-row items-center">
          <Avatar
            name={request.userName}
            avatarId={request.userAvatarId}
            size="lg"
          />
          <View className="flex-1 ml-4">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Colaborador
            </Text>
            <Text className="text-gray-800 dark:text-gray-100 font-bold text-xl">
              {formatShortName(request.userName)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Clock size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-1 font-medium">
                Solicitado em {formattedDates.creation}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
              Período Solicitado
            </Text>
            <View className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
              <Text className="text-purple-600 dark:text-purple-400 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase">
                De
              </Text>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                {formattedDates.start}
              </Text>
            </View>
            <ArrowRight size={20} color={isDark ? "#4B5563" : "#9CA3AF"} />
            <View>
              <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase">
                Até
              </Text>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                {formattedDates.end}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={toggleAccordion}
          activeOpacity={0.8}
          className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl border border-gray-100 dark:border-gray-800 mb-6"
        >
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold text-gray-700 dark:text-gray-200">
              Observação do Colaborador
            </Text>

            {isExpanded ? (
              <ChevronUp size={20} color="#9CA3AF" />
            ) : (
              <ChevronDown size={20} color="#9CA3AF" />
            )}
          </View>
          <Text
            className="text-gray-500 italic leading-relaxed"
            numberOfLines={isExpanded ? undefined : 3}
          >
            {request.observation || "Nenhuma observação informada."}
          </Text>
        </TouchableOpacity>

        {!status.isPending && (
          <View className="mb-6">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 px-1">
              Dados da Decisão
            </Text>
            <View className="flex-row items-center mb-4">
              <Avatar
                name={request.managerName || "G"}
                avatarId={request.managerAvatarId}
                size="lg"
              />
              <View className="ml-4 flex-1">
                <Text
                  className={`font-bold text-base ${
                    status.isApproved ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  Solicitação{" "}
                  {status.isApproved ? "aprovada ✅" : "reprovada ❌"}
                </Text>
                <Text className="text-gray-500 text-xs">
                  por {formatShortName(request.managerName || "Gestor")}
                </Text>
                {formattedDates.update && (
                  <Text className="text-gray-400 text-[10px] mt-0.5">
                    em {formattedDates.update}
                  </Text>
                )}
              </View>
            </View>

            {request.managerObservation && (
              <View
                className={`p-5 rounded-2xl border ${
                  status.isApproved
                    ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100"
                    : "bg-rose-50 dark:bg-rose-900/10 border-rose-100"
                }`}
              >
                <Text
                  className={`italic font-medium ${
                    status.isApproved
                      ? "text-emerald-900 dark:text-emerald-200"
                      : "text-rose-900 dark:text-rose-200"
                  }`}
                >
                  "{request.managerObservation}"
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View
        className="absolute bottom-[-20] right-[-50] opacity-5 -z-10"
        pointerEvents="none"
      >
        <Calendar size={300} color={isDark ? "#FFF" : "#000"} />
      </View>
    </ScreenWrapper>
  );
}
