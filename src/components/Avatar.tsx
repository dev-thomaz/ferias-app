import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { getInitials } from "@/utils/textUtils";

interface AvatarProps {
  name: string;
  avatarId?: string | number | null;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({ name, avatarId, size = "md" }: AvatarProps) {
  const classSizes = {
    sm: { container: "w-8 h-8", text: "text-xs" },
    md: { container: "w-10 h-10", text: "text-sm" },
    lg: { container: "w-14 h-14", text: "text-xl" },
    xl: { container: "w-20 h-20", text: "text-3xl" },
  };

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const currentClass = classSizes[size];
  const currentPixel = pixelSizes[size];

  const hasAvatar =
    avatarId !== null &&
    avatarId !== undefined &&
    String(avatarId).trim() !== "";

  const imageUrl = `https://avatar.iran.liara.run/public/${avatarId}`;

  if (hasAvatar) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: currentPixel,
          height: currentPixel,
          borderRadius: 999,
          backgroundColor: "#e5e7eb",
        }}
        contentFit="cover"
        transition={300}
        cachePolicy="memory-disk"
        key={String(avatarId)}
      />
    );
  }

  return (
    <View
      className={`${currentClass.container} rounded-full bg-emerald-100 border border-emerald-200 items-center justify-center`}
      style={{ width: currentPixel, height: currentPixel, borderRadius: 999 }}
    >
      <Text className={`${currentClass.text} font-bold text-emerald-700`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
