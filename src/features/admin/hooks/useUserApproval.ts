import { useState, useEffect, useCallback } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import {
  adminService,
  PendingUser,
} from "@/features/admin/services/adminService";
import { DialogState } from "@/types";
import { formatShortName } from "@/utils/textUtils";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function useUserApproval() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingUsers();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAction = async (
    user: PendingUser,
    action: "APPROVE" | "REJECT"
  ) => {
    setProcessingId(user.id);
    try {
      if (action === "APPROVE") {
        await adminService.approveUser(user.id);
        setDialog({
          visible: true,
          title: "Acesso Liberado!",
          message: `${formatShortName(user.name)} já pode acessar o sistema.`,
          variant: "success",
        });
      } else {
        await adminService.rejectUser(user.id);
      }

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível processar a ação.",
        variant: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  return {
    users,
    loading,
    processingId,
    dialog,
    handleAction,
    closeDialog,
    refresh: loadData,
  };
}
