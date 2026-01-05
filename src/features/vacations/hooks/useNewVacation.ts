import { useState, useMemo, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { addDays, differenceInDays, startOfDay } from "date-fns";
import NetInfo from "@react-native-community/netinfo";

import { vacationService } from "../services/vacationService";
import { configService } from "@/features/vacations/services/configService";
import { CreateVacationDTO, User, DialogState } from "@/types";

export function useNewVacation(user: User | null) {
  const navigation = useNavigation();

  const [minDaysNotice, setMinDaysNotice] = useState(0);
  const [minDate, setMinDate] = useState(new Date());

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 15));
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
    onConfirm: () => {},
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await configService.getVacationConfig();

        setMinDaysNotice(config.minDaysNotice);

        const calculatedMinDate = addDays(
          startOfDay(new Date()),
          config.minDaysNotice
        );

        setMinDate(calculatedMinDate);

        if (startDate < calculatedMinDate) {
          setStartDate(calculatedMinDate);
          setEndDate(addDays(calculatedMinDate, 15));
        }
      } catch (error) {
        console.error("Erro ao carregar config de férias:", error);
      }
    }
    loadConfig();
  }, []);

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
      const network = await NetInfo.fetch();
      const isOnline = !!network.isConnected && !!network.isInternetReachable;

      const requestData: CreateVacationDTO = {
        userId: user.id,
        userName: user.name,
        userAvatarId: user.avatarID ?? null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        observation: observation.trim(),
      };

      await vacationService.createRequest(requestData);

      setDialog({
        visible: true,
        title: isOnline ? "Solicitação Enviada! 🌴" : "Salvo no Dispositivo 📡",
        message: isOnline
          ? "Seu gestor foi notificado e sua solicitação está pendente."
          : "Você está sem internet, mas salvamos sua solicitação no aparelho. Ela será enviada automaticamente assim que a conexão voltar.",
        variant: isOnline ? "success" : "info",
        onConfirm: () => {
          setDialog((d) => ({ ...d, visible: false }));
          navigation.goBack();
        },
      });
    } catch (error) {
      console.error("ERRO CRÍTICO AO CRIAR FÉRIAS:", error);
      setDialog({
        visible: true,
        title: "Erro inesperado",
        message:
          "Não foi possível processar a solicitação no momento. Tente novamente.",
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
    minDate,
    minDaysNotice,
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
