import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";

import {
  Search,
  X,
  ArrowLeft,
  UserCheck,
  UserX,
  LucideIcon,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { Dialog } from "@/components/Dialog";
import { useEmployeesList } from "@/features/admin/hooks/useEmployeesList";
import { EmployeeListItem } from "@/features/admin/components/EmployeeListItem";

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  Icon?: LucideIcon;
}

const FilterChip = ({ label, active, onPress, Icon }: FilterChipProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = active ? "#FFF" : isDark ? "#9CA3AF" : "#6B7280";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
        active
          ? "bg-purple-600 border-purple-600 shadow-md"
          : "bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800"
      }`}
    >
      {Icon && <Icon size={14} color={iconColor} style={{ marginRight: 6 }} />}
      <Text
        className={`font-bold text-xs ${
          active ? "text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export function EmployeesListScreen() {
  const navigation = useNavigation();
  const {
    users,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    dialog,
    closeDialog,
    actions,
  } = useEmployeesList();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="bg-purple-700 pt-12 pb-6 px-6 rounded-b-[40px] shadow-lg shadow-purple-900/20 z-10">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center border border-purple-500"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white font-bold text-xl tracking-tight">
            Colaboradores
          </Text>
          <View className="w-10" />
        </View>

        <View className="bg-purple-800/40 flex-row items-center px-4 rounded-2xl border border-purple-400/30 h-12">
          <Search size={18} color="#E9D5FF" />
          <TextInput
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#E9D5FF"
            className="flex-1 ml-3 text-white font-medium h-full"
            autoCapitalize="none"
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <X size={16} color="#E9D5FF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="flex-1 mt-4">
        <View className="py-4 bg-transparent">
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
            <View className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-2 self-center opacity-50" />

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

            <View className="w-[1px] h-6 bg-gray-300 dark:bg-gray-700 mx-2 self-center opacity-50" />

            <FilterChip
              label="Gestores"
              active={roleFilter === "GESTOR"}
              onPress={() => setRoleFilter("GESTOR")}
            />
            <FilterChip
              label="Colaboradores"
              active={roleFilter === "COLABORADOR"}
              onPress={() => setRoleFilter("COLABORADOR")}
            />
          </ScrollView>
        </View>

        <View className="flex-1 px-6">
          {loading ? (
            <View className="mt-20 justify-center items-center">
              <ActivityIndicator size="large" color="#9333EA" />
              <Text className="text-gray-400 dark:text-gray-500 mt-4 font-medium">
                Carregando equipe...
              </Text>
            </View>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <EmployeeListItem
                  item={item}
                  onStatusPress={actions.openStatusDialog}
                  onResetPress={actions.openResetDialog}
                />
              )}
              contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              ListEmptyComponent={() => (
                <View className="items-center mt-20 opacity-40">
                  <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-full mb-4 shadow-sm">
                    <Search size={48} color={isDark ? "#4B5563" : "#9CA3AF"} />
                  </View>
                  <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg text-center">
                    Nenhum colaborador
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 mt-1 text-center max-w-[200px]">
                    Não encontramos ninguém com os filtros atuais.
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </View>

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        confirmText={dialog.confirmText}
        onConfirm={dialog.onConfirm}
        onCancel={closeDialog}
        cancelText="Voltar"
      />
    </View>
  );
}
