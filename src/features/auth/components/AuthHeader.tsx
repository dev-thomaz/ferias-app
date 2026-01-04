import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";

import logoImg from "@assets/logo.png";

export function AuthHeader() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="bg-blue-600 h-[30%] justify-end items-center pb-12 rounded-b-[40px] shadow-lg shadow-blue-900/20 z-10">
      <View className="absolute top-12 right-6">
        <TouchableOpacity
          onPress={toggleColorScheme}
          className="p-2 bg-blue-500/30 rounded-full border border-blue-400/50"
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={20} color="#fff" />
          ) : (
            <Moon size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View className="">
        <Image
          source={logoImg}
          className="w-[120px] h-[120px]"
          resizeMode="contain"
        />
      </View>

      <Text className="text-4xl font-bold text-white tracking-tight">
        Férias App
      </Text>
      <Text className="text-blue-100 mt-1 font-medium">
        Gestão inteligente de descanso
      </Text>
    </View>
  );
}
