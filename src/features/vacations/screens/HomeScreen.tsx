import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Button } from "@/components/Button";
import { vacationService } from "../services/vacationService";
import { VacationCard } from "../components/VacationCard";
import { ActionModal } from "../components/ActionModal";

export function HomeScreen() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result =
        user.role === "COLABORADOR"
          ? await vacationService.getUserVacations(user.id)
          : await vacationService.getPendingRequests();

      setData(result);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as solicitações.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const handleCardPress = (item: any) => {
    if (user?.role !== "GESTOR" || item.status !== "PENDING") return;

    Alert.alert(
      "Analisar Solicitação",
      `Colaborador: ${item.userName}\nO que deseja fazer?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reprovar ❌",
          style: "destructive",
          onPress: () => {
            setSelectedRequest(item);
            setActionType("REJECT");
            setModalVisible(true);
          },
        },
        {
          text: "Aprovar ✅",
          onPress: () => {
            setSelectedRequest(item);
            setActionType("APPROVE");
            setModalVisible(true);
          },
        },
      ]
    );
  };

  const handleDecision = async (observation: string) => {
    if (!selectedRequest || !user) return;

    setActionLoading(true);
    try {
      const newStatus = actionType === "APPROVE" ? "APPROVED" : "REJECTED";

      await vacationService.updateStatus(
        selectedRequest.id,
        newStatus,
        user.id,
        observation
      );

      setModalVisible(false);
      await loadData();

      Alert.alert(
        "Sucesso",
        `Solicitação ${newStatus === "APPROVED" ? "Aprovada" : "Reprovada"}!`
      );
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar o status.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6 pt-16">
      {/* Cabeçalho */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-gray-500">Bem-vindo,</Text>
          <Text className="text-2xl font-bold text-secondary">
            {user?.name}
          </Text>
          <Text className="text-xs font-bold text-primary mt-1 px-2 py-0.5 bg-blue-50 self-start rounded-full border border-blue-100">
            {user?.role}
          </Text>
        </View>
        <View className="w-20">
          <Button title="Sair" variant="danger" onPress={logout} />
        </View>
      </View>

      {/* Título da Seção */}
      <Text className="text-xl font-bold text-secondary mb-4">
        {user?.role === "COLABORADOR"
          ? "Minhas Solicitações"
          : "Pendentes de Aprovação"}
      </Text>

      {/* Listagem */}
      {loading && data.length === 0 ? (
        <ActivityIndicator size="large" color="#2563EB" className="mt-10" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={
                user?.role === "GESTOR" && item.status === "PENDING" ? 0.7 : 1
              }
              onPress={() => handleCardPress(item)}
            >
              <VacationCard item={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="bg-surface p-8 rounded-3xl shadow-sm border border-gray-100 items-center mt-4">
              <Text className="text-gray-400 text-center text-lg">
                {user?.role === "COLABORADOR"
                  ? "Você ainda não possui solicitações."
                  : "Nenhuma solicitação pendente no momento. 🎉"}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Botão Flutuante para Colaborador (FAB) */}
      {user?.role === "COLABORADOR" && (
        <View className="absolute bottom-6 left-6 right-6">
          <Button
            title="Nova Solicitação +"
            variant="success"
            onPress={() => navigation.navigate("NewVacation" as never)}
          />
        </View>
      )}

      {/* Modal de Decisão (Gestor) */}
      <ActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDecision}
        action={actionType}
        isLoading={actionLoading}
      />
    </View>
  );
}
