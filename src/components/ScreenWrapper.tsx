import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ScrollViewProps,
} from "react-native";

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  withScroll?: boolean;
}

export function ScreenWrapper({ children, withScroll = true, ...rest }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background-light dark:bg-background-dark"
    >
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
