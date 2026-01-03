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

export function EmployeeView({ request }: { request: VacationRequest }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { isExpanded, duration, formattedDates, status, toggleAccordion } =
    useVacationDetailsBase(request);

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row justify-between items-start mb-6 gap-x-2">
            <View className="flex-1">
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg">
                Seu Período
              </Text>
              <View className="flex-row items-center mt-1">
                <Clock size={12} color={isDark ? "#6B7280" : "#9CA3AF"} />
                <Text className="text-gray-400 dark:text-gray-500 text-[10px] ml-1 font-bold uppercase tracking-widest">
                  Solicitado em {formattedDates.creation}
                </Text>
              </View>
            </View>

            <View className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full shrink-0">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">
                Início
              </Text>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                {formattedDates.start}
              </Text>
            </View>
            <ArrowRight size={20} color={isDark ? "#4B5563" : "#9CA3AF"} />
            <View className="items-end">
              <Text className="text-gray-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">
                Fim
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
              Minha Observação
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
          <View className="animate-in fade-in duration-500">
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
                <Text className="text-gray-400 text-xs font-medium">
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
                    ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800"
                }`}
              >
                <Text
                  className={`italic leading-relaxed ${
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
