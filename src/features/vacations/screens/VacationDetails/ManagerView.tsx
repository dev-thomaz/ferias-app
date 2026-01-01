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
      console.error("ERRO AO ATUALIZAR STATUS:", e);

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
        contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex-row items-center">
          <View className="mr-4">
            <Avatar
              name={request.userName}
              avatarId={request.userAvatarId}
              size="lg"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 text-xs font-bold uppercase">
              Solicitante
            </Text>
            <Text className="text-gray-800 font-bold text-xl">
              {formatShortName(request.userName)}
            </Text>

            <View className="flex-row items-center mt-1">
              <Feather name="clock" size={12} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs ml-1 font-medium">
                Solicitado em {formattedCreationDate}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-800 font-bold">Período Solicitado</Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs font-bold">
                {duration} dias
              </Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
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
                Observação do Colaborador
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
                  Solicitação{" "}
                  {request.status === "APPROVED"
                    ? "aprovada ✅"
                    : "reprovada ❌"}
                  {"\n"}
                  <Text className="text-gray-500 text-sm font-medium">
                    por {formatShortName(request.managerName || "Gestor")}
                  </Text>
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

      {isPending && (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-6 pt-4 border-t border-gray-100 shadow-2xl">
          <Text className="text-center text-gray-400 text-xs mb-3 font-medium">
            Selecione uma ação
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              className="flex-1 bg-rose-50 border border-rose-100 py-4 rounded-xl items-center"
              onPress={() => {
                setActionType("REJECT");
                setConfirmSheetVisible(true);
              }}
            >
              <Text className="text-rose-600 font-bold">Reprovar ❌</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-emerald-600 py-4 rounded-xl items-center shadow-lg shadow-emerald-200"
              onPress={() => {
                setActionType("APPROVE");
                setConfirmSheetVisible(true);
              }}
            >
              <Text className="text-white font-bold">Aprovar ✅</Text>
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
