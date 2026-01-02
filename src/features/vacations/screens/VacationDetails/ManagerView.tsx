import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { parseISO, differenceInDays } from "date-fns";
import { useColorScheme } from "nativewind";

import { managerService } from "../../services/managerService";
import { VacationRequest } from "../../types";
import { formatShortName } from "@/utils/textUtils";
import { formatDate } from "@/utils/dateUtils";
import { Avatar } from "@/components/Avatar";
import { ActionModal } from "../../components/ActionModal";
import { ConfirmationSheet } from "../../components/ConfirmationSheet";
import { Dialog, DialogVariant } from "@/components/Dialog";

export function ManagerView({
  request,
  user,
}: {
  request: VacationRequest & { id: string };
  user: any;
}) {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [confirmSheetVisible, setConfirmSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

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

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const finalSubmit = async (observation: string) => {
    setLoading(true);
    try {
      const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
      const safeAvatarId =
        user?.avatarID ?? user?.avatarId ?? user?.avatar ?? null;

      await managerService.updateStatus(
        request.id,
        status,
        user.id,
        user.name,
        observation || "",
        safeAvatarId
      );

      setModalVisible(false);
      setDialog({
        visible: true,
        title: "Sucesso!",
        message: `Solicitação ${
          actionType === "APPROVE" ? "aprovada" : "reprovada"
        } com sucesso.`,
        variant: "success",
      });
    } catch (e: any) {
      setDialog({
        visible: true,
        title: "Erro na Operação",
        message:
          e?.response?.data?.message || "Falha ao processar. Tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
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
        contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex-row items-center">
          <View className="mr-4">
            <Avatar
              name={request.userName}
              avatarId={request.userAvatarId}
              size="lg"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase">
              Solicitante
            </Text>
            <Text className="text-gray-800 dark:text-gray-100 font-bold text-xl">
              {formatShortName(request.userName)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Feather
                name="clock"
                size={12}
                color={isDark ? "#6B7280" : "#9CA3AF"}
              />
              <Text className="text-gray-400 dark:text-gray-500 text-xs ml-1 font-medium">
                Solicitado em {formattedCreationDate}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-surface-light dark:bg-surface-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-800 dark:text-gray-100 font-bold">
              Período Solicitado
            </Text>
            <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-400 dark:text-gray-500 text-xs mb-1 uppercase font-bold">
                De
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
              <Text className="text-gray-400 dark:text-gray-500 text-xs mb-1 uppercase font-bold">
                Até
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
                Observação do Colaborador
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
                  Solicitação {isApproved ? "aprovada ✅" : "reprovada ❌"}
                  {"\n"}
                  <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    por {formatShortName(request.managerName || "Gestor")}
                  </Text>
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

      {isPending && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark p-6 pt-4 border-t border-gray-100 dark:border-gray-800 shadow-2xl">
          <Text className="text-center text-gray-400 dark:text-gray-500 text-xs mb-3 font-bold uppercase tracking-widest">
            Selecione uma ação
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 py-4 rounded-xl items-center"
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
              className="flex-1 bg-emerald-600 py-4 rounded-xl items-center shadow-lg shadow-emerald-500/20"
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
      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={() => {
          setDialog((d) => ({ ...d, visible: false }));
          if (dialog.variant === "success") navigation.goBack();
        }}
      />
    </View>
  );
}
