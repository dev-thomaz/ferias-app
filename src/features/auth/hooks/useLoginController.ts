import { useState, useCallback } from "react";
import { Keyboard, LayoutAnimation } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import { UserRole, DialogState } from "@/types";
import { authService } from "../services/authService";
import { mapAuthError } from "@/utils/mapAuthError";

export function useLoginController() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("COLABORADOR");
  const [useAvatar, setUseAvatar] = useState(false);
  const [gender, setGender] = useState<"M" | "F">("M");

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
    onConfirm: () => {},
  });

  const setUser = useAuthStore((state) => state.setUser);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("COLABORADOR");
    setUseAvatar(false);
    setGender("M");
  }, []);

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  const toggleMode = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    resetForm();
    setIsRegistering((prev) => !prev);
  };

  const handleAuth = async () => {
    Keyboard.dismiss();

    if (!email || !password || (isRegistering && !name)) {
      setDialog({
        visible: true,
        title: "Atenção",
        message: "Por favor, preencha todos os campos obrigatórios.",
        variant: "warning",
        onConfirm: closeDialog,
      });
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const finalAvatarID = useAvatar
          ? gender === "M"
            ? Math.floor(Math.random() * 50) + 1
            : Math.floor(Math.random() * 50) + 51
          : null;

        await authService.register(name, email, password, role, finalAvatarID);

        setDialog({
          visible: true,
          title: "Solicitação enviada!",
          message:
            "O teu cadastro foi recebido. Aguarde a aprovação do administrador para aceder.",
          variant: "success",
          onConfirm: () => {
            closeDialog();
            resetForm();
            setIsRegistering(false);
          },
        });
      } else {
        const userData = await authService.login(email, password);

        setUser(userData);
      }
    } catch (error) {
      const friendlyMessage = mapAuthError(error);

      setDialog({
        visible: true,
        title: "Erro de Acesso",
        message: friendlyMessage,
        variant: "error",
        onConfirm: closeDialog,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      await authService.seedUsers();
      setDialog({
        visible: true,
        title: "Seed",
        message: "Dados restaurados.",
        variant: "success",
        onConfirm: closeDialog,
      });
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Falha no seed.",
        variant: "error",
        onConfirm: closeDialog,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistering,
    loading,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    useAvatar,
    setUseAvatar,
    gender,
    setGender,
    dialog,
    handleAuth,
    toggleMode,
    handleSeed,
    closeDialog,
  };
}
