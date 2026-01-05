import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import { ArrowLeft, CheckCircle } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { Dialog } from "@/components/Dialog";
import { useUserApproval } from "@/features/admin/hooks/useUserApproval";
import { UserApprovalItem } from "@/features/admin/components/UserApprovalItem";

export function UserApprovalScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { users, loading, processingId, dialog, handleAction, closeDialog } =
    useUserApproval();

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
            <ArrowLeft size={20} color="#fff" />
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
            renderItem={({ item }) => (
              <UserApprovalItem
                item={item}
                isProcessing={processingId === item.id}
                onApprove={(u) => handleAction(u, "APPROVE")}
                onReject={(u) => handleAction(u, "REJECT")}
              />
            )}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-20 opacity-60">
                <View className="bg-surface-light dark:bg-surface-dark p-6 rounded-full mb-4 shadow-sm">
                  <CheckCircle
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
        onConfirm={closeDialog}
      />
    </View>
  );
}
