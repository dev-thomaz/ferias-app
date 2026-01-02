import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

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
          <Feather name={isDark ? "sun" : "moon"} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md">
        <Feather name="umbrella" size={40} color="#fff" />
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
