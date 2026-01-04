import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  ScrollView,
} from "react-native";

import {
  Search,
  X,
  ArrowLeft,
  UserCheck,
  UserX,
  Key,
  Mail,
  LucideIcon,
  Zap,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { adminService } from "../services/adminService";
import { User, UserRole } from "@/types";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { Dialog, DialogVariant } from "@/components/Dialog";

type StatusFilter = "ALL" | "ACTIVE" | "DISABLED";
type RoleFilter = "ALL" | UserRole;

export function EmployeesListScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

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

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === "ALL" || u.accountStatus === statusFilter;
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  const handleToggleStatus = async (
    userId: string,
    currentStatus: string | undefined
  ) => {
    setDialog((d) => ({ ...d, visible: false }));

    const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";

    try {
      await adminService.updateUserStatus(userId, newStatus as any);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, accountStatus: newStatus as any } : u
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const closeDialog = () => {
    setDialog((d) => ({ ...d, visible: false }));
  };

  const handleResetPassword = async (email: string) => {
    try {
      await adminService.resetUserPassword(email);
      setDialog({
        visible: true,
        title: "E-mail Enviado",
        message: "O link de recuperação foi enviado com sucesso.",
        variant: "success",
        confirmText: "OK",
        onConfirm: () => setDialog((d) => ({ ...d, visible: false })),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openStatusDialog = (user: User) => {
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

  const openResetDialog = (user: User) => {
    setDialog({
      visible: true,
      title: "Resetar Senha",
      message: `Enviar e-mail de recuperação para ${user.email}?`,
      variant: "warning",
      confirmText: "Enviar E-mail",
      onConfirm: () => handleResetPassword(user.email),
    });
  };

  const FilterChip = ({ label, active, onPress, Icon }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
        active
          ? "bg-purple-600 border-purple-600 shadow-sm"
          : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800"
      }`}
    >
      {Icon && (
        <Icon
          size={14}
          color={active ? "#FFF" : isDark ? "#9CA3AF" : "#6B7280"}
          style={{ marginRight: 6 }}
        />
      )}
      <Text
        className={`font-bold text-xs ${
          active ? "text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: User }) => {
    const isActive = item.accountStatus === "ACTIVE";
    const isSyncing = item.isSyncing;

    return (
      <View
        className={`bg-surface-light dark:bg-surface-dark rounded-3xl mb-4 shadow-sm border ${
          isActive
            ? isSyncing
              ? "border-blue-400"
              : "border-gray-100 dark:border-gray-800"
            : "border-gray-200 dark:border-gray-800 bg-background-light dark:bg-background-dark/30"
        }`}
      >
        <View className="p-4 flex-row items-center">
          <View style={{ opacity: isActive ? 1 : 0.5 }}>
            <Avatar name={item.name} avatarId={item.avatarID} size="md" />
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text
                className={`font-bold text-base ${
                  isActive
                    ? "text-gray-800 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {formatShortName(item.name)}
              </Text>

              {isSyncing ? (
                <View className="ml-2 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded flex-row items-center">
                  <Zap size={8} color="#3b82f6" />
                  <Text className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase ml-1">
                    Sinc.
                  </Text>
                </View>
              ) : (
                !isActive && (
                  <View className="ml-2 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    <Text className="text-[8px] font-black text-gray-500 dark:text-gray-300 uppercase">
                      Inativo
                    </Text>
                  </View>
                )
              )}
            </View>
            <Text className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              {item.role}
            </Text>
          </View>

          <View className="flex-row gap-x-2">
            <TouchableOpacity
              onPress={() => openResetDialog(item)}
              className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full items-center justify-center border border-amber-100 dark:border-amber-900/30"
            >
              <Key size={16} color={isDark ? "#fbbf24" : "#d97706"} />
            </TouchableOpacity>

            {item.role !== "ADMIN" && (
              <TouchableOpacity
                onPress={() => openStatusDialog(item)}
                className={`w-10 h-10 rounded-full items-center justify-center border ${
                  isActive
                    ? "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30"
                    : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30"
                }`}
              >
                {isActive ? (
                  <UserX size={16} color={isDark ? "#fb7185" : "#ef4444"} />
                ) : (
                  <UserCheck size={16} color={isDark ? "#34d399" : "#10b981"} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="px-4 pb-3 flex-row items-center">
          <Mail size={10} color={isDark ? "#4B5563" : "#9CA3AF"} />
          <Text className="text-gray-400 dark:text-gray-500 text-[10px] ml-1">
            {item.email}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="bg-purple-700 pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-xl">Colaboradores</Text>
          <View className="w-10" />
        </View>

        <View className="bg-white/10 dark:bg-black/20 flex-row items-center px-4 rounded-2xl border border-white/20 h-12 mb-2">
          <Search size={18} color="#E9D5FF" />
          <TextInput
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#E9D5FF"
            className="flex-1 ml-3 text-white font-medium"
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <X size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <FilterChip
            label="Todos"
            active={statusFilter === "ALL" && roleFilter === "ALL"}
            onPress={() => {
              setStatusFilter("ALL");
              setRoleFilter("ALL");
            }}
          />
          <FilterChip
            label="Ativos"
            active={statusFilter === "ACTIVE"}
            onPress={() => setStatusFilter("ACTIVE")}
            Icon={UserCheck}
          />
          <FilterChip
            label="Inativos"
            active={statusFilter === "DISABLED"}
            onPress={() => setStatusFilter("DISABLED")}
            Icon={UserX}
          />
          <View className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-2 self-center" />
          <FilterChip
            label="Gestores"
            active={roleFilter === "GESTOR"}
            onPress={() => setRoleFilter("GESTOR")}
          />
          <FilterChip
            label="Colab."
            active={roleFilter === "COLABORADOR"}
            onPress={() => setRoleFilter("COLABORADOR")}
          />
        </ScrollView>
      </View>

      <View className="flex-1 px-6">
        {loading ? (
          <ActivityIndicator size="large" color="#9333EA" className="mt-20" />
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            extraData={users}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            ListEmptyComponent={() => (
              <View className="items-center mt-20 opacity-40">
                <Search size={48} color={isDark ? "#4B5563" : "#9CA3AF"} />
                <Text className="text-gray-500 dark:text-gray-400 mt-4 font-bold text-center">
                  Nenhum resultado encontrado
                </Text>
              </View>
            )}
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
