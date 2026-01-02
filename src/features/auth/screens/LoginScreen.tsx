import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  ScrollView,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore, UserRole } from "@/features/auth/store/useAuthStore";
import { authService } from "../services/authService";
import { Button } from "@/components/Button";
import { Dialog, DialogVariant } from "@/components/Dialog";
import { StatusBar } from "expo-status-bar";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("COLABORADOR");

  const [useAvatar, setUseAvatar] = useState(false);
  const [gender, setGender] = useState<"M" | "F">("M");

  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
    onConfirm: () => {},
  });

  const setUser = useAuthStore((state) => state.setUser);

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, visible: false }));
  };

  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsRegistering(!isRegistering);
    setDialog((prev) => ({ ...prev, visible: false }));
  };

  const handleAuth = async () => {
    Keyboard.dismiss();

    if (!email || !password || (isRegistering && !name)) {
      setDialog({
        visible: true,
        title: "Campos obrigatórios",
        message: "Por favor, preencha todos os campos para continuar.",
        variant: "warning",
        onConfirm: closeDialog,
      });
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        let finalAvatarID: number | null = null;
        if (useAvatar) {
          finalAvatarID =
            gender === "M"
              ? Math.floor(Math.random() * 50) + 1
              : Math.floor(Math.random() * 50) + 51;
        }

        await authService.register(name, email, password, role, finalAvatarID);

        setDialog({
          visible: true,
          title: "Solicitação Enviada!",
          message:
            "Sua conta foi criada com sucesso e enviada para aprovação do administrador. Aguarde a liberação para acessar.",
          variant: "success",
          onConfirm: () => {
            closeDialog();
            setIsRegistering(false);
            setName("");
            setPassword("");
            setRole("COLABORADOR");
            setUseAvatar(false);
          },
        });
      } else {
        const userData = await authService.login(email, password);
        setUser(userData as any);
      }
    } catch (error: any) {
      console.error("Erro Login:", error.message);

      let title = "Acesso Negado";
      let message = "Ocorreu um erro inesperado.";
      let variant: DialogVariant = "error";

      let manualLogout = false;

      if (error.message === "ACCOUNT_PENDING") {
        title = "Cadastro em Análise";
        message =
          "Sua conta ainda está aguardando aprovação do administrador. Você será notificado quando o acesso for liberado.";
        variant = "warning";
        manualLogout = true;
      } else if (error.message === "ACCOUNT_DISABLED") {
        title = "Conta Desativada";
        message =
          "Esta conta foi desativada pelo administrador. Entre em contato com o suporte.";
        variant = "error";
        manualLogout = true;
      } else if (error.message === "USER_NOT_FOUND") {
        message = "Usuário não encontrado. Verifique o e-mail digitado.";
      } else if (
        error.code === "auth/invalid-credential" ||
        error.message.includes("invalid-credential")
      ) {
        message = "E-mail ou senha incorretos.";
      } else if (error.code === "auth/email-already-in-use") {
        message = "Este e-mail já está cadastrado.";
        title = "Atenção";
      } else if (error.code === "auth/weak-password") {
        message = "A senha deve ter pelo menos 6 caracteres.";
        title = "Senha Fraca";
      }

      setDialog({
        visible: true,
        title,
        message,
        variant,

        onConfirm: async () => {
          closeDialog();
          if (manualLogout) {
            await authService.logout();
          }
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      await authService.seedUsers();
      setDialog({
        visible: true,
        title: "Banco de Dados",
        message: "Usuários de teste recriados com sucesso.",
        variant: "success",
        onConfirm: closeDialog,
      });
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro no Seed",
        message: "Não foi possível criar os usuários de teste.",
        variant: "error",
        onConfirm: closeDialog,
      });
    }
  };

  const RoleSelector = () => (
    <View className="mb-4">
      <Text className="text-gray-500 dark:text-gray-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">
        Eu sou:
      </Text>
      <View className="flex-row gap-3">
        {(["COLABORADOR", "GESTOR", "ADMIN"] as UserRole[]).map((r) => {
          const isSelected = role === r;
          let activeColor = "bg-blue-600 border-blue-600";
          if (r === "GESTOR") activeColor = "bg-blue-600 border-blue-600";
          if (r === "ADMIN") activeColor = "bg-purple-600 border-purple-600";
          if (r === "COLABORADOR")
            activeColor = "bg-emerald-600 border-emerald-600";

          return (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-xl border items-center justify-center ${
                isSelected
                  ? activeColor
                  : "bg-background-light dark:bg-background-dark border-gray-200"
              }`}
            >
              <Text
                className={`text-[10px] font-bold uppercase ${
                  isSelected ? "text-white" : "text-gray-400"
                }`}
              >
                {r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const AvatarSelector = () => (
    <View className="mb-2 bg-background-light dark:bg-background-dark p-3 rounded-xl border border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Feather name="smile" size={18} color="#4B5563" />
          <Text className="text-gray-600 font-medium ml-2">
            Usar avatar personalizado?
          </Text>
        </View>
        <Switch
          value={useAvatar}
          onValueChange={(val) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setUseAvatar(val);
          }}
          trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
          thumbColor={useAvatar ? "#2563EB" : "#F3F4F6"}
        />
      </View>

      {useAvatar && (
        <View className="mt-3 flex-row gap-3">
          <TouchableOpacity
            onPress={() => setGender("M")}
            className={`flex-1 py-2 rounded-lg border flex-row items-center justify-center ${
              gender === "M"
                ? "bg-blue-100 border-blue-200"
                : "bg-surface-light dark:bg-surface-dark border-gray-200"
            }`}
          >
            <Feather
              name="user"
              size={16}
              color={gender === "M" ? "#1D4ED8" : "#9CA3AF"}
            />
            <Text
              className={`ml-2 text-xs font-bold ${
                gender === "M"
                  ? "text-blue-700"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Masculino
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setGender("F")}
            className={`flex-1 py-2 rounded-lg border flex-row items-center justify-center ${
              gender === "F"
                ? "bg-pink-100 border-pink-200"
                : "bg-surface-light dark:bg-surface-dark border-gray-200"
            }`}
          >
            <Feather
              name="user"
              size={16}
              color={gender === "F" ? "#BE185D" : "#9CA3AF"}
            />
            <Text
              className={`ml-2 text-xs font-bold ${
                gender === "F"
                  ? "text-pink-700"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Feminino
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface-light dark:bg-surface-dark"
    >
      <StatusBar style="light" />

      <View className="bg-blue-600 h-[30%] justify-end items-center pb-12 rounded-b-[40px] shadow-lg shadow-blue-900/20 z-10">
        <View className="bg-surface-light dark:bg-surface-dark/20 p-4 rounded-2xl mb-4 backdrop-blur-md">
          <Feather name="umbrella" size={40} color="#fff" />
        </View>
        <Text className="text-4xl font-bold text-white tracking-tight">
          Férias App
        </Text>
        <Text className="text-blue-100 mt-1 font-medium">
          Gestão inteligente de descanso
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
            {isRegistering ? "Crie sua conta" : "Bem-vindo de volta"}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            {isRegistering
              ? "Preencha os dados e escolha seu perfil."
              : "Informe suas credenciais para acessar."}
          </Text>
        </View>

        <View className="gap-y-4 mb-6">
          {isRegistering && (
            <View className="bg-background-light dark:bg-background-dark flex-row items-center px-4 rounded-xl border border-gray-200 h-14 focus:border-blue-500">
              <Feather name="user" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Nome Completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                className="flex-1 ml-3 text-gray-800 dark:text-gray-100 font-medium"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="bg-background-light dark:bg-background-dark flex-row items-center px-4 rounded-xl border border-gray-200 h-14">
            <Feather name="mail" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="E-mail corporativo"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 ml-3 text-gray-800 dark:text-gray-100 font-medium"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="bg-background-light dark:bg-background-dark flex-row items-center px-4 rounded-xl border border-gray-200 h-14">
            <Feather name="lock" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="flex-1 ml-3 text-gray-800 dark:text-gray-100 font-medium"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {isRegistering && (
            <>
              <RoleSelector />
              <AvatarSelector />
            </>
          )}
        </View>

        <Button
          title={isRegistering ? "Solicitar Acesso" : "Entrar"}
          onPress={handleAuth}
          isLoading={loading}
          variant="primary"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 dark:text-gray-400">
            {isRegistering ? "Já tem acesso? " : "Novo por aqui? "}
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Text className="text-blue-600 font-bold">
              {isRegistering ? "Fazer Login" : "Criar conta"}
            </Text>
          </TouchableOpacity>
        </View>

        {!isRegistering && (
          <TouchableOpacity
            onPress={handleSeed}
            className="mt-12 self-center opacity-30"
          >
            <Text className="text-xs text-gray-400">
              Restaurar Dados de Teste
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={dialog.onConfirm}
      />
    </KeyboardAvoidingView>
  );
}
