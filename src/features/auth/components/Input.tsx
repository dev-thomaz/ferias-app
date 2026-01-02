import React, { useState, ComponentProps } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  icon: ComponentProps<typeof Feather>["name"];
  onClear?: () => void;
}

export function Input({
  icon,
  onClear,
  value,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordField = secureTextEntry !== undefined;

  return (
    <View className="bg-background-light dark:bg-background-dark flex-row items-center px-4 rounded-xl border border-gray-200 dark:border-gray-800 h-14 focus:border-blue-500">
      <Feather name={icon} size={20} color="#9CA3AF" />

      <TextInput
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-3 text-gray-800 dark:text-gray-100 font-medium h-full"
        value={value}
        secureTextEntry={isPasswordField && !isPasswordVisible}
        {...rest}
      />

      <View className="flex-row items-center gap-x-2">
        {/* Botão de Limpar (X) - Aparece apenas se houver texto e a função onClear for passada */}
        {value && value.length > 0 && onClear && !isPasswordField && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
            <Feather name="x" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {/* Botão do Olho - Aparece apenas em campos de senha */}
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
