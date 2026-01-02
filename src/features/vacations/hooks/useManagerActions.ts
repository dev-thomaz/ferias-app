import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
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
      const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
      const safeAvatarId =
        user?.avatarID ?? user?.avatarId ?? user?.avatar ?? null;

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

  const closeDialog = () => {
    setDialog((d) => ({ ...d, visible: false }));
    if (dialog.variant === "success") navigation.goBack();
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
