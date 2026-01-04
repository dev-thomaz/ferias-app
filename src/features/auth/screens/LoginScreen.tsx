import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Mail, Lock } from "lucide-react-native";

import { useLoginController } from "../hooks/useLoginController";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { AuthHeader } from "../components/AuthHeader";
import { RegisterForm } from "../components/RegisterForm";

export function LoginScreen() {
  const {
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
  } = useLoginController();

  return (
    <ScreenWrapper isLoading={loading}>
      <StatusBar style="light" />
      <AuthHeader />

      <View className="p-6 justify-center flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
            {isRegistering ? "Cria a tua conta" : "Bem-vindo de volta"}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            {isRegistering
              ? "Preenche os dados e escolhe o teu perfil."
              : "Informa as tuas credenciais para aceder."}
          </Text>
        </View>

        <View className="gap-y-4 mb-6">
          {isRegistering && (
            <RegisterForm
              name={name}
              setName={setName}
              role={role}
              setRole={setRole}
              useAvatar={useAvatar}
              setUseAvatar={setUseAvatar}
              gender={gender}
              setGender={setGender}
              onCancel={toggleMode}
            />
          )}

          <Input
            icon={Mail}
            placeholder="E-mail corporativo"
            value={email}
            onChangeText={setEmail}
            onClear={() => setEmail("")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Input
            icon={Lock}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Button
          title={isRegistering ? "Solicitar Acesso" : "Entrar"}
          onPress={handleAuth}
          isLoading={loading}
          variant="primary"
        />

        {!isRegistering && (
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500 dark:text-gray-400">
              Novo por aqui?{" "}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text className="text-blue-600 font-bold">Criar conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Dialog {...dialog} />
    </ScreenWrapper>
  );
}
