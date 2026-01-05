import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  Clock,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Calendar,
  ShieldAlert,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";

import { VacationRequest, User } from "@/types";
import { formatShortName } from "@/utils/textUtils";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/Avatar";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { ActionModal } from "../../components/ActionModal";
import { ConfirmationSheet } from "../../components/ConfirmationSheet";
import { Dialog } from "@/components/Dialog";

import { useVacationDetailsBase } from "../../hooks/useVacationDetailsBase";
import { useManagerActions } from "../../hooks/useManagerActions";
import { configService } from "@/features/vacations/services/configService";

interface AdminViewProps {
  request: VacationRequest;
  user: User;
}

export function AdminView({ request, user }: AdminViewProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [adminCanManage, setAdminCanManage] = useState(true);

  const { isExpanded, duration, formattedDates, status, toggleAccordion } =
    useVacationDetailsBase(request);

  const {
    confirmSheetVisible,
    setConfirmSheetVisible,
    modalVisible,
    setModalVisible,
    actionType,
    setActionType,
    loading,
    dialog,
    finalSubmit,
    closeDialog,
  } = useManagerActions(request.id, user);

  useEffect(() => {
    let mounted = true;
    configService.getVacationConfig().then((config) => {
      if (mounted) {
        setAdminCanManage(config.adminCanManageVacations);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const showActions = status.isPending && adminCanManage;

  return (
    <ScreenWrapper isLoading={loading} withScroll={false}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 24,
          paddingBottom: showActions ? 180 : 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex-row items-center">
          <Avatar
            name={request.userName}
            avatarId={request.userAvatarId}
            size="lg"
          />
          <View className="flex-1 ml-4">
            <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Colaborador
            </Text>
            <Text className="text-gray-800 dark:text-gray-100 font-bold text-xl">
              {formatShortName(request.userName)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Clock size={12} color="#9CA3AF" />

              <Text className="text-gray-400 dark:text-gray-500 text-xs ml-1 font-medium">
                Solicitado em{" "}
                {formatDate(request.createdAt, "dd/MM/yyyy HH:mm")}
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
            className="text-gray-500 dark:text-gray-400 italic leading-relaxed"
            numberOfLines={isExpanded ? undefined : 3}
          >
            {request.observation || "Nenhuma observação informada."}
          </Text>
        </TouchableOpacity>

        {!status.isPending && (
          <View className="mb-6">
            <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4 px-1">
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
                <Text className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                  por {formatShortName(request.managerName || "Gestor")}
                </Text>

                {request.updatedAt && (
                  <Text className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5 font-bold">
                    em {formatDate(request.updatedAt, "dd/MM/yyyy HH:mm")}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {showActions && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark p-6 pb-10 border-t border-gray-100 dark:border-gray-800 shadow-2xl">
          <View className="flex-row items-center mb-4 bg-orange-50 dark:bg-orange-900/10 p-2 rounded-xl border border-orange-100 dark:border-orange-800/30">
            <ShieldAlert size={14} color="#EA580C" />
            <Text className="text-[10px] text-orange-700 dark:text-orange-400 font-bold ml-2 uppercase">
              Ação Administrativa Liberada
            </Text>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 py-4 rounded-2xl items-center"
              onPress={() => {
                setActionType("REJECT");
                setConfirmSheetVisible(true);
              }}
            >
              <Text className="text-rose-600 dark:text-rose-400 font-bold uppercase text-xs">
                Reprovar ❌
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-purple-700 py-4 rounded-2xl items-center shadow-lg shadow-purple-500/20"
              onPress={() => {
                setActionType("APPROVE");
                setConfirmSheetVisible(true);
              }}
            >
              <Text className="text-white font-bold uppercase text-xs">
                Aprovar ✅
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ConfirmationSheet
        visible={confirmSheetVisible}
        onClose={() => setConfirmSheetVisible(false)}
        onConfirm={() => {
          setConfirmSheetVisible(false);
          setTimeout(() => setModalVisible(true), 300);
        }}
        action={actionType}
      />
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={finalSubmit}
        action={actionType}
        isLoading={loading}
      />
      <Dialog {...dialog} onConfirm={closeDialog} />

      <View
        className="absolute bottom-[-20] right-[-50] opacity-5 -z-10"
        pointerEvents="none"
      >
        <Calendar size={300} color={isDark ? "#FFF" : "#000"} />
      </View>
    </ScreenWrapper>
  );
}
