import { useState, useCallback } from "react";
import { LayoutAnimation } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";

import { adminService } from "@/features/admin/services/adminService";
import { RootStackParamList } from "@/types/navigation";

type AdminNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAdminHome() {
  const navigation = useNavigation<AdminNavigationProp>();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const pendingUsers = await adminService.getPendingUsers();
      setPendingCount(pendingUsers.length);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const handleToggleTheme = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleColorScheme();
  };

  const navigateToUserApproval = () => navigation.navigate("UserApproval");
  const navigateToEmployees = () => navigation.navigate("EmployeesList");
  const navigateToAudits = () => navigation.navigate("AllVacations");
  const navigateToSettings = () => navigation.navigate("AdminSettings");

  return {
    loading,
    pendingCount,
    hasPending: pendingCount > 0,
    isDark: colorScheme === "dark",
    toggleColorScheme: handleToggleTheme,
    refreshDashboard: loadDashboardData,
    navigation: {
      toUserApproval: navigateToUserApproval,
      toEmployees: navigateToEmployees,
      toAudits: navigateToAudits,
      toSettings: navigateToSettings,
    },
  };
}
