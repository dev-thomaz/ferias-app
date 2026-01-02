import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Dialog } from "@/components/Dialog";

import { ManagerHome } from "./ManagerHome";
import { EmployeeHome } from "./EmployeeHome";
import { AdminHome } from "@/features/admin/screens/AdminHome";
import { colorScheme, useColorScheme } from "nativewind";

export function HomeScreen() {
  const { user, logout } = useAuthStore();
  const [logoutDialog, setLogoutDialog] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const handleLogoutPress = () => {
    setLogoutDialog(true);
  };

  const confirmLogout = () => {
    setLogoutDialog(false);
    logout();
  };

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  const renderContent = () => {
    switch (user.role) {
      case "ADMIN":
        return <AdminHome user={user} onLogout={handleLogoutPress} />;
      case "GESTOR":
        return <ManagerHome user={user} onLogout={handleLogoutPress} />;
      case "COLABORADOR":
      default:
        return <EmployeeHome user={user} onLogout={handleLogoutPress} />;
    }
  };

  return (
    <View
      className={`flex-1 bg-background-light dark:bg-background-dark ${
        isAdmin ? "" : "pt-12"
      }`}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {renderContent()}

      <Dialog
        visible={logoutDialog}
        title="Sair da Conta"
        message="Tem certeza que deseja desconectar do aplicativo?"
        variant="warning"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutDialog(false)}
      />
    </View>
  );
}
