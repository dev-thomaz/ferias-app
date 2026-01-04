import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { managerService } from "../services/managerService";
import { DialogVariant } from "@/components/Dialog";

export function useManagerActions(requestId: string, user: any) {
  const navigation = useNavigation();
  const [confirmSheetVisible, setConfirmSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const finalSubmit = async (observation: string) => {
    setLoading(true);
    try {
      const network = await NetInfo.fetch();
      const isOnline = !!network.isConnected && !!network.isInternetReachable;

      const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
      const safeAvatarId = user?.avatarID ?? user?.avatarId ?? null;

      await managerService.updateStatus(
        requestId,
        status,
        user.id,
        user.name,
        observation || "",
        safeAvatarId
      );

      setLoading(false);
      setModalVisible(false);

      setDialog({
        visible: true,
        title: isOnline ? "Sucesso!" : "Ação Registrada Offline! 📡",
        message: isOnline
          ? `Solicitação ${
              actionType === "APPROVE" ? "aprovada" : "reprovada"
            } com sucesso.`
          : `Você está sem conexão. A decisão foi salva localmente e será sincronizada em breve.`,
        variant: isOnline ? "success" : "info",
      });
    } catch (e: any) {
      console.error("Erro ao processar ação do gestor:", e);
      setLoading(false);
      setDialog({
        visible: true,
        title: "Ops!",
        message: "Não foi possível registrar sua decisão. Tente novamente.",
        variant: "error",
      });
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
