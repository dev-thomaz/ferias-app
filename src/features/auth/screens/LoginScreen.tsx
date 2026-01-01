import React, { useState } from "react";
import { View, Text, TextInput, Keyboard } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { authService } from "../services/authService";
import { Button } from "@/components/Button";
import { Dialog, DialogVariant } from "@/components/Dialog";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const setUser = useAuthStore((state) => state.setUser);

  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, visible: false }));
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !password) {
      setDialog({
        visible: true,
        title: "Campos obrigatórios",
        message:
          "Por favor, preencha seu e-mail e senha para acessar o sistema.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData as any);
    } catch (error: any) {
      console.error(error);
      setDialog({
        visible: true,
        title: "Acesso Negado",
        message: "E-mail ou senha incorretos. Verifique suas credenciais.",
        variant: "error",
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
        message:
          "Usuários de teste (Gestor e Colaborador) foram criados/verificados com sucesso.",
        variant: "success",
      });
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro no Seed",
        message: "Não foi possível criar os usuários de teste.",
        variant: "error",
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-background">
      <Text className="text-4xl font-bold text-primary mb-2 text-center">
        Férias App
      </Text>
      <Text className="text-secondary mb-10 text-center text-lg">
        Área do Colaborador e Gestor
      </Text>

      <View className="gap-y-4 mb-8">
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-surface p-4 rounded-xl border border-gray-200"
        />
        <TextInput
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-surface p-4 rounded-xl border border-gray-200"
        />
      </View>

      <Button
        title="Entrar no Sistema"
        onPress={handleLogin}
        isLoading={loading}
      />

      <View className="mt-10 opacity-50">
        <Button
          title="Criar Usuários de Teste (Seed)"
          variant="secondary"
          onPress={handleSeed}
        />
      </View>

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={closeDialog}
      />
    </View>
  );
}
