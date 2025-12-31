import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { authService } from "../services/authService";
import { Button } from "@/components/Button";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Erro", "Preencha todos os campos");

    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData as any);
    } catch (error: any) {
      Alert.alert("Erro de Autenticação", "E-mail ou senha inválidos.");
      console.error(error);
    } finally {
      setLoading(false);
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

      {/* BOTÃO DE SEED - Use apenas para criar os usuários na primeira vez */}
      <View className="mt-10 opacity-50">
        <Button
          title="Criar Usuários de Teste (Seed)"
          variant="secondary"
          onPress={async () => {
            await authService.seedUsers();
            Alert.alert("Seed", "Usuários criados ou já existentes.");
          }}
        />
      </View>
    </View>
  );
}
