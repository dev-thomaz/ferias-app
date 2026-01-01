import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Dialog } from "@/components/Dialog";

import { ManagerHome } from "./ManagerHome";
import { EmployeeHome } from "./EmployeeHome";

export function HomeScreen() {
  const { user, logout } = useAuthStore();
  const [logoutDialog, setLogoutDialog] = useState(false);

  const handleLogoutPress = () => {
    setLogoutDialog(true);
  };

  const confirmLogout = () => {
    setLogoutDialog(false);
    logout();
  };

  if (!user) return null;

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {user.role === "GESTOR" ? (
        <ManagerHome user={user} onLogout={handleLogoutPress} />
      ) : (
        <EmployeeHome user={user} onLogout={handleLogoutPress} />
      )}

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
