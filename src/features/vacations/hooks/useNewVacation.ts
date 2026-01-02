import { useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { addDays, differenceInDays } from "date-fns";
import { vacationService } from "../services/vacationService";
import { CreateVacationDTO } from "../types";
import { User } from "@/features/auth/store/useAuthStore";
import { DialogVariant } from "@/components/Dialog";

export function useNewVacation(user: User | null) {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
    onConfirm: () => {},
  });

  const duration = useMemo(() => {
    const diff = differenceInDays(endDate, startDate);
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  const handleCreate = async () => {
    if (!user) return;
    if (duration <= 0) {
      setDialog({
        visible: true,
        title: "Datas Inválidas",
        message: "A data final deve ser posterior à data inicial.",
        variant: "warning",
        onConfirm: closeDialog,
      });
      return;
    }

    setLoading(true);
    try {
      const requestData: CreateVacationDTO = {
        userId: user.id,
        userName: user.name,
        userAvatarId: (user as any).avatarID || (user as any).avatarId || null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        observation: observation.trim(),
      };

      await vacationService.createRequest(requestData);

      setDialog({
        visible: true,
        title: "Tudo certo! 🌴",
        message: "Sua solicitação foi enviada com sucesso.",
        variant: "success",
        onConfirm: () => {
          closeDialog();
          navigation.goBack();
        },
      });
    } catch (error: any) {
      setDialog({
        visible: true,
        title: "Erro",
        message: error?.message || "Não foi possível criar a solicitação.",
        variant: "error",
        onConfirm: closeDialog,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    observation,
    setObservation,
    loading,
    duration,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    dialog,
    handleCreate,
    closeDialog,
  };
}
