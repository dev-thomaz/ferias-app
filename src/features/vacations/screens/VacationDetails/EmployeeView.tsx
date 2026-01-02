import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { parseISO, differenceInDays } from "date-fns";
import { useColorScheme } from "nativewind";

import { VacationRequest } from "../../types";
import { formatShortName } from "@/utils/textUtils";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/Avatar";

export function EmployeeView({ request }: { request: VacationRequest }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isExpanded, setIsExpanded] = useState(false);
  const isPending = request.status === "PENDING";
  const isApproved =
    request.status === "APPROVED" || (request.status as string) === "COMPLETED";

  const duration = useMemo(
    () =>
      differenceInDays(parseISO(request.endDate), parseISO(request.startDate)),
    [request]
  );

  const formattedCreationDate = useMemo(() => {
    return formatDate(request.createdAt, "dd 'de' MMMM 'às' HH:mm");
  }, [request.createdAt]);

  const formattedUpdateDate = useMemo(() => {
    if (!request.updatedAt) return null;
    return formatDate(request.updatedAt, "dd 'de' MMMM 'às' HH:mm");
  }, [request.updatedAt]);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="flex-1 relative overflow-hidden bg-background-light dark:bg-background-dark">
      <View
        className="absolute bottom-[-20] right-[-50] opacity-5"
        style={{ zIndex: -1 }}
        pointerEvents="none"
      >
        <Feather
          name="calendar"
          size={300}
          color={isDark ? "#FFF" : "#000"}
          style={{ transform: [{ rotate: "-15deg" }] }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-800 dark:text-gray-100 font-bold text-base">
                Seu Período
              </Text>

              <View className="flex-row items-center mt-1">
                <Feather
                  name="clock"
                  size={10}
                  color={isDark ? "#6B7280" : "#9CA3AF"}
                />
                <Text className="text-gray-400 dark:text-gray-400 text-[10px] ml-1 font-medium uppercase tracking-wide">
                  Solicitado em {formattedCreationDate}
                </Text>
              </View>
            </View>

            <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full self-start">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                DE
              </Text>
              <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">
                {formatDate(request.startDate)}
              </Text>
            </View>
            <Feather
              name="arrow-right"
              size={20}
              color={isDark ? "#4B5563" : "#9CA3AF"}
            />
            <View>
              <Text className="text-gray-400 dark:text-gray-500 text-xs mb-1">
                ATÉ
              </Text>
              <Text className="text-gray-800 dark:text-gray-100 font-medium text-base">
                {formatDate(request.endDate)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.7}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700 dark:text-gray-200 font-bold ml-1">
                Sua Observação
              </Text>
              <View className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
              </View>
            </View>

            <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
              <Text
                className="text-gray-600 dark:text-gray-400 leading-relaxed italic"
                numberOfLines={isExpanded ? undefined : 3}
              >
                {request.observation || "Nenhuma observação informada."}
              </Text>

              {!isExpanded &&
                request.observation &&
                request.observation.length > 100 && (
                  <Text className="text-blue-500 dark:text-blue-400 text-xs mt-2 font-bold">
                    Ver mais...
                  </Text>
                )}
            </View>
          </TouchableOpacity>
        </View>

        {!isPending && (
          <View className="mb-6">
            <View className="flex-row items-center mb-4 ml-1">
              <Avatar
                name={request.managerName || "Gestor"}
                avatarId={request.managerAvatarId}
                size="lg"
              />
              <View className="ml-4 flex-1 justify-center">
                <Text
                  className={`font-bold text-base leading-tight ${
                    isApproved
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-rose-700 dark:text-rose-400"
                  }`}
                >
                  Sua solicitação foi{" "}
                  {isApproved ? "aprovada ✅" : "reprovada ❌"}
                  {"\n"}
                  <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    por {formatShortName(request.managerName || "Gestor")}
                  </Text>
                  {formattedUpdateDate && (
                    <>
                      {"\n"}
                      <Text className="text-gray-400 dark:text-gray-500 text-xs font-normal">
                        em {formattedUpdateDate}
                      </Text>
                    </>
                  )}
                </Text>
              </View>
            </View>

            {request.managerObservation && (
              <View
                className={`p-5 rounded-2xl border ${
                  isApproved
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800"
                }`}
              >
                <Text
                  className={`leading-relaxed italic ${
                    isApproved
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
    </View>
  );
}
