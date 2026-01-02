import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useColorScheme } from "nativewind";

import { adminService, PendingUser } from "../services/adminService";
import { Avatar } from "@/components/Avatar";
import { formatShortName } from "@/utils/textUtils";
import { Dialog, DialogVariant } from "@/components/Dialog";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function UserApprovalScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingUsers();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (
    user: PendingUser,
    action: "APPROVE" | "REJECT"
  ) => {
    setProcessingId(user.id);
    try {
      if (action === "APPROVE") {
        await adminService.approveUser(user.id);
        setDialog({
          visible: true,
          title: "Acesso Liberado!",
          message: `${formatShortName(user.name)} já pode acessar o sistema.`,
          variant: "success",
        });
      } else {
        await adminService.rejectUser(user.id);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível processar a ação.",
        variant: "error",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const renderItem = ({ item }: { item: PendingUser }) => {
    const isProcessing = processingId === item.id;

    const roleColors = {
      GESTOR: {
        bg: isDark ? "bg-blue-900/30" : "bg-blue-100",
        text: isDark ? "text-blue-400" : "text-blue-700",
        border: isDark ? "border-blue-800/50" : "border-blue-200",
      },
      ADMIN: {
        bg: isDark ? "bg-purple-900/30" : "bg-purple-100",
        text: isDark ? "text-purple-400" : "text-purple-700",
        border: isDark ? "border-purple-800/50" : "border-purple-200",
      },
      COLABORADOR: {
        bg: isDark ? "bg-emerald-900/30" : "bg-emerald-100",
        text: isDark ? "text-emerald-400" : "text-emerald-700",
        border: isDark ? "border-emerald-800/50" : "border-emerald-200",
      },
    };

    const roleStyle =
      roleColors[item.role as keyof typeof roleColors] ||
      roleColors.COLABORADOR;

    return (
      <View className="bg-surface-light dark:bg-surface-dark rounded-3xl mb-4 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <View className="p-5 flex-row items-start">
          <Avatar name={item.name} avatarId={item.avatarID} size="md" />

          <View className="ml-4 flex-1">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight mb-1">
                  {formatShortName(item.name)}
                </Text>
                <View
                  className={`self-start px-2 py-0.5 rounded-md ${roleStyle.bg} border ${roleStyle.border}`}
                >
                  <Text
                    className={`text-[10px] font-bold uppercase ${roleStyle.text}`}
                  >
                    {item.role}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                  Aguardando há
                </Text>
                <Text className="text-xs text-purple-600 dark:text-purple-400 font-bold">
                  {formatDistanceToNow(parseISO(item.createdAt), {
                    locale: ptBR,
                  }).replace("cerca de ", "")}
                </Text>
              </View>
            </View>

            <Text
              className="text-gray-500 dark:text-gray-400 text-sm mt-2"
              numberOfLines={1}
            >
              {item.email}
            </Text>
          </View>
        </View>

        <View className="flex-row border-t border-gray-100 dark:border-gray-800">
          <TouchableOpacity
            disabled={isProcessing}
            onPress={() => handleAction(item, "REJECT")}
            className="flex-1 py-4 bg-background-light dark:bg-background-dark active:opacity-70 items-center flex-row justify-center border-r border-gray-100 dark:border-gray-800"
          >
            <Feather name="x-circle" size={18} color="#EF4444" />
            <Text className="ml-2 font-bold text-gray-600 dark:text-gray-400">
              Rejeitar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isProcessing}
            onPress={() => handleAction(item, "APPROVE")}
            className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-900/20 active:opacity-70 items-center flex-row justify-center"
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <>
                <Feather
                  name="check-circle"
                  size={18}
                  color={isDark ? "#34d399" : "#059669"}
                />
                <Text
                  className={`ml-2 font-bold ${
                    isDark ? "text-emerald-400" : "text-emerald-700"
                  }`}
                >
                  Aprovar
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View className="bg-purple-700 pt-12 pb-8 px-6 rounded-b-[32px] shadow-lg shadow-purple-900/20 z-10">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-purple-600 rounded-full items-center justify-center border border-purple-500"
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View className="bg-purple-600 px-3 py-1 rounded-full border border-purple-500">
            <Text className="text-purple-100 font-bold text-xs">
              {users.length} pendentes
            </Text>
          </View>
        </View>

        <Text className="text-white font-bold text-3xl">Novos Usuários</Text>
        <Text className="text-purple-200 text-base mt-1">
          Gerencie o acesso à plataforma
        </Text>
      </View>

      <View className="flex-1 -mt-4 px-6">
        {loading ? (
          <View className="mt-20 justify-center items-center">
            <ActivityIndicator size="large" color="#9333EA" />
            <Text className="text-gray-400 dark:text-gray-500 mt-4 font-medium">
              Carregando solicitações...
            </Text>
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-20 opacity-60">
                <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-full mb-4 shadow-sm">
                  <Feather
                    name="check-circle"
                    size={48}
                    color={isDark ? "#34d399" : "#10B981"}
                  />
                </View>
                <Text className="text-gray-800 dark:text-gray-100 font-bold text-lg text-center">
                  Tudo Limpo!
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 mt-1 text-center max-w-[200px]">
                  Não há novos cadastros aguardando sua aprovação no momento.
                </Text>
              </View>
            }
          />
        )}
      </View>

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        variant={dialog.variant}
        onConfirm={() => setDialog((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
