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

import { VacationRequest } from "../../types";
import { formatShortName } from "@/utils/textUtils";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/Avatar";

export function EmployeeView({ request }: { request: VacationRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isPending = request.status === "PENDING";

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
    <View className="flex-1 relative overflow-hidden bg-gray-50">
      <View
        className="absolute bottom-[-20] right-[-50] opacity-5"
        style={{ zIndex: -1 }}
        pointerEvents="none"
      >
        <Feather
          name="calendar"
          size={300}
          color="#000"
          style={{ transform: [{ rotate: "-15deg" }] }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-gray-800 font-bold text-base">
                Seu Período
              </Text>

              <View className="flex-row items-center mt-1">
                <Feather name="clock" size={10} color="#9CA3AF" />
                <Text className="text-gray-400 text-[10px] ml-1 font-medium uppercase tracking-wide">
                  Solicitado em {formattedCreationDate}
                </Text>
              </View>
            </View>

            <View className="bg-blue-50 px-3 py-1 rounded-full self-start">
              <Text className="text-blue-600 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <View>
              <Text className="text-gray-400 text-xs mb-1">DE</Text>
              <Text className="text-gray-800 font-medium text-base">
                {formatDate(request.startDate)}
              </Text>
            </View>
            <Feather name="arrow-right" size={20} color="#9CA3AF" />
            <View>
              <Text className="text-gray-400 text-xs mb-1">ATÉ</Text>
              <Text className="text-gray-800 font-medium text-base">
                {formatDate(request.endDate)}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.7}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-gray-700 font-bold ml-1">
                Sua Observação
              </Text>
              <View className="bg-gray-100 p-1 rounded-full">
                <Feather
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </View>
            </View>

            <View className="bg-white p-5 rounded-2xl border border-gray-200">
              <Text
                className="text-gray-600 leading-relaxed italic"
                numberOfLines={isExpanded ? undefined : 3}
              >
                {request.observation || "Nenhuma observação informada."}
              </Text>

              {!isExpanded &&
                request.observation &&
                request.observation.length > 100 && (
                  <Text className="text-blue-500 text-xs mt-2 font-bold">
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
                    request.status === "APPROVED"
                      ? "text-emerald-700"
                      : "text-rose-700"
                  }`}
                >
                  Sua solicitação foi{" "}
                  {request.status === "APPROVED"
                    ? "aprovada ✅"
                    : "reprovada ❌"}
                  {"\n"}
                  <Text className="text-gray-500 text-sm font-medium">
                    por {formatShortName(request.managerName || "Gestor")}
                  </Text>
                  {formattedUpdateDate && (
                    <>
                      {"\n"}
                      <Text className="text-gray-400 text-xs font-normal">
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
                  request.status === "APPROVED"
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-rose-50 border-rose-100"
                }`}
              >
                <Text
                  className={`leading-relaxed italic ${
                    request.status === "APPROVED"
                      ? "text-emerald-900"
                      : "text-rose-900"
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
