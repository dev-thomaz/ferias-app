import { useState, useEffect, useCallback } from "react";
import { configService } from "@/features/vacations/services/configService";
import { VacationConfig, DialogState } from "@/types";

export function useAdminConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverConfig, setServerConfig] = useState<VacationConfig | null>(null);

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  const loadConfig = useCallback(async () => {
    try {
      const result = await configService.getVacationConfig();
      setServerConfig(result);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const saveBatchConfig = async (newConfig: VacationConfig) => {
    setSaving(true);
    try {
      await configService.updateVacationConfig(newConfig);
      setServerConfig(newConfig);

      setDialog({
        visible: true,
        title: "Sucesso",
        message: "As regras de negócio foram atualizadas com sucesso.",
        variant: "success",
      });

      return true;
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);

      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "error",
      });

      return false;
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, visible: false }));
  };

  return {
    loading,
    saving,
    serverConfig,
    dialog,
    closeDialog,
    saveBatchConfig,
    refresh: loadConfig,
  };
}
