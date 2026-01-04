import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ScrollViewProps,
  View,
  Text,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { WifiOff } from "lucide-react-native";
import { Loading } from "./Loading";

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  withScroll?: boolean;
  isLoading?: boolean;
}

export function ScreenWrapper({
  children,
  withScroll = true,
  isLoading = false,
  ...rest
}: Props) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && (state.isInternetReachable ?? true);
      setIsOnline(!!online);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background-light dark:bg-background-dark"
    >
      {!isOnline && (
        <View className="bg-amber-500 pt-12 pb-3 px-6 flex-row justify-center items-center shadow-md z-50">
          <WifiOff size={14} color="white" />
          <Text className="text-white text-[11px] font-bold ml-2 uppercase tracking-wider">
            Modo Offline • Usando dados locais
          </Text>
        </View>
      )}

      {withScroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          {...rest}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  );
}
