import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { managerService } from "../services/managerService";
import { DialogState, User } from "@/types";

export function useManagerActions(requestId: string, user: User) {
  const navigation = useNavigation();
  const [confirmSheetVisible, setConfirmSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const finalSubmit = async (observation: string) => {
    setLoading(true);
    try {
      const network = await NetInfo.fetch();
      const isOnline = !!network.isConnected && !!network.isInternetReachable;

      const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";

      const safeAvatarId =
        typeof user.avatarID === "number" ? user.avatarID : null;

      await managerService.updateStatus(
        requestId,
        status,
        user.id,
        user.name,
        observation || "",
        safeAvatarId
      );

      setModalVisible(false);

      setDialog({
        visible: true,
        title: isOnline ? "Sucesso!" : "Ação Salva Offline! 📡",
        message: isOnline
          ? `Solicitação ${
              actionType === "APPROVE" ? "aprovada" : "reprovada"
            } com sucesso.`
          : `Você está sem conexão, mas registramos sua decisão. Ela será sincronizada assim que a internet voltar.`,
        variant: isOnline ? "success" : "info",
      });
    } catch (error) {
      console.error("Erro ao processar ação do gestor:", error);

      setDialog({
        visible: true,
        title: "Ops!",
        message: "Não foi possível registrar sua decisão. Tente novamente.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setDialog((d) => ({ ...d, visible: false }));

    if (dialog.variant === "success" || dialog.variant === "info") {
      navigation.goBack();
    }
  };

  return {
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
  };
}
