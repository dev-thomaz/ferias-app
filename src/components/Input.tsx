import React, { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { X, Eye, EyeOff, LucideIcon } from "lucide-react-native";

interface InputProps extends TextInputProps {
  icon: LucideIcon;
  onClear?: () => void;
  containerClassName?: string;
}

export function Input({
  icon: Icon,
  onClear,
  value,
  secureTextEntry,
  containerClassName,
  className,
  ...rest
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry !== undefined;

  return (
    <View
      className={`bg-background-light dark:bg-background-dark flex-row items-center px-4 rounded-xl border border-gray-200 dark:border-gray-800 h-14 focus:border-blue-500 ${containerClassName}`}
    >
      <Icon size={20} color="#9CA3AF" />

      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`flex-1 ml-3 text-gray-800 dark:text-gray-100 font-medium h-full ${className}`}
        value={value}
        secureTextEntry={isPasswordField && !isPasswordVisible}
        {...rest}
      />

      <View className="flex-row items-center gap-x-2">
        {value && value.length > 0 && onClear && !isPasswordField && (
          <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
            <X size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={18} color="#9CA3AF" />
            ) : (
              <Eye size={18} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
