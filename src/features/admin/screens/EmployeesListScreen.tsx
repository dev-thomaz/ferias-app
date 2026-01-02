import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { adminService } from "../services/adminService";
import { User } from "@/features/auth/store/useAuthStore";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { Dialog, DialogVariant } from "@/components/Dialog";

export function EmployeesListScreen() {
  const navigation = useNavigation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
    onConfirm: () => {},
    confirmText: "Confirmar",
  });

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllEmployees();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openStatusDialog = (user: any) => {
    const isActive = user.accountStatus === "ACTIVE";
    setDialog({
      visible: true,
      title: isActive ? "Desativar Usuário" : "Reativar Usuário",
      message: `Deseja ${
        isActive ? "remover" : "restaurar"
      } o acesso de ${formatShortName(user.name)}?`,
      variant: isActive ? "error" : "success",
      confirmText: isActive ? "Desativar" : "Reativar",
      onConfirm: () => handleToggleStatus(user.id, user.accountStatus),
    });
  };

  const openResetDialog = (user: any) => {
    setDialog({
      visible: true,
      title: "Resetar Senha",
      message: `Enviar e-mail de recuperação de senha para ${user.email}?`,
      variant: "warning",
      confirmText: "Enviar E-mail",
      onConfirm: () => handleResetPassword(user.email),
    });
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
    try {
      await adminService.updateUserStatus(userId, newStatus as any);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, accountStatus: newStatus as any } : u
        )
      );
      setDialog((d) => ({ ...d, visible: false }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await adminService.resetUserPassword(email);
      setDialog({
        visible: true,
        title: "E-mail Enviado",
        message: "O link de recuperação foi enviado para o colaborador.",
        variant: "success",
        confirmText: "OK",
        onConfirm: () => setDialog((d) => ({ ...d, visible: false })),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isActive = item.accountStatus === "ACTIVE";

    return (
      <View
        className={`bg-white rounded-3xl mb-4 shadow-sm border ${
          isActive ? "border-gray-100" : "border-gray-200 bg-gray-50"
        }`}
      >
        <View className="p-4 flex-row items-center">
          <View style={{ opacity: isActive ? 1 : 0.4 }}>
            <Avatar name={item.name} avatarId={item.avatarID} size="md" />
          </View>

          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text
                className={`font-bold text-base ${
                  isActive ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {formatShortName(item.name)}
              </Text>
              {!isActive && (
                <View className="ml-2 bg-gray-200 px-1.5 py-0.5 rounded">
                  <Text className="text-[8px] font-bold text-gray-500 uppercase">
                    OFF
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {item.role}
            </Text>
          </View>

          {/* Botões de Ação Rápidos */}
          <View className="flex-row gap-x-2">
            <TouchableOpacity
              onPress={() => openResetDialog(item)}
              className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center border border-amber-100"
            >
              <Feather name="key" size={16} color="#d97706" />
            </TouchableOpacity>

            {item.role !== "ADMIN" && (
              <TouchableOpacity
                onPress={() => openStatusDialog(item)}
                className={`w-10 h-10 rounded-full items-center justify-center border ${
                  isActive
                    ? "bg-red-50 border-red-100"
                    : "bg-emerald-50 border-emerald-100"
                }`}
              >
                <Feather
                  name={isActive ? "user-x" : "user-check"}
                  size={16}
                  color={isActive ? "#ef4444" : "#10b981"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Info adicional discreta */}
        <View className="px-4 pb-3 flex-row items-center">
          <Feather name="mail" size={10} color="#9CA3AF" />
          <Text className="text-gray-400 text-[10px] ml-1">{item.email}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-purple-700 pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-4 w-10 h-10 bg-purple-600 rounded-full items-center justify-center"
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white font-bold text-3xl">Colaboradores</Text>
        <Text className="text-purple-200 text-base">
          Gestão de acessos e segurança
        </Text>
      </View>

      <View className="flex-1 px-6 -mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#9333EA" className="mt-20" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        confirmText={dialog.confirmText}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog((d) => ({ ...d, visible: false }))}
        cancelText="Voltar"
      />
    </View>
  );
}
