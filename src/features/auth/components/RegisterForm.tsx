import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "@/components/Input";
import { RoleSelector } from "./RoleSelector";
import { AvatarSelector } from "./AvatarSelector";
import { UserRole } from "../store/useAuthStore";

interface RegisterFormProps {
  name: string;
  setName: (t: string) => void;
  role: UserRole;
  setRole: (r: UserRole) => void;
  useAvatar: boolean;
  setUseAvatar: (v: boolean) => void;
  gender: "M" | "F";
  setGender: (g: "M" | "F") => void;
  onCancel: () => void;
}

export function RegisterForm({
  name,
  setName,
  role,
  setRole,
  useAvatar,
  setUseAvatar,
  gender,
  setGender,
  onCancel,
}: RegisterFormProps) {
  return (
    <View className="gap-y-4">
      <Input
        icon="user"
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        onClear={() => setName("")}
      />

      <RoleSelector selectedRole={role} onSelect={setRole} />

      <AvatarSelector
        useAvatar={useAvatar}
        onToggleAvatar={setUseAvatar}
        gender={gender}
        onSelectGender={setGender}
      />

      <TouchableOpacity onPress={onCancel} className="py-2 active:opacity-60">
        <Text className="text-center text-gray-400 dark:text-gray-500 font-semibold">
          Cancelar e voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
