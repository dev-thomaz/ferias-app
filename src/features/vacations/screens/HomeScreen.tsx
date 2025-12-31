import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { vacationService } from "../services/vacationService";
import { VacationCard } from "../components/VacationCard";
import { ActionModal } from "../components/ActionModal";

export function HomeScreen() {
  const { user, logout } = useAuthStore();
  const navigation = useNavigation();

  // Estados
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [actionLoading, setActionLoading] = useState(false);

  // Cores dinâmicas baseadas no papel
  const isManager = user?.role === "GESTOR";
  const primaryColor = isManager ? "bg-blue-600" : "bg-emerald-600";
  const shadowColor = isManager
    ? "shadow-blue-500/30"
    : "shadow-emerald-500/30";

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = isManager
        ? await vacationService.getPendingRequests()
        : await vacationService.getUserVacations(user.id);

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
    if (!isManager || item.status !== "PENDING") return;

    Alert.alert(
      "Analisar Solicitação",
      `Colaborador: ${item.userName}\nO que deseja fazer?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reprovar",
          style: "destructive",
          onPress: () => {
            setSelectedRequest(item);
            setActionType("REJECT");
            setModalVisible(true);
          },
        },
        {
          text: "Aprovar",
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

  // --- Lógica de UX do Dashboard ---

  const getHeroStatus = () => {
    // 1. Gestor vê número
    if (isManager) return data.length;

    // 2. Colaborador sem histórico
    if (data.length === 0) return "Sem planos";

    // 3. Colaborador com histórico (pega o mais recente)
    const lastStatus = data[0].status;
    switch (lastStatus) {
      case "PENDING":
        return "Em Análise";
      case "APPROVED":
        return "Aprovado!";
      case "REJECTED":
        return "Não aceito";
      default:
        return "Ativo";
    }
  };

  const getHeroSubtitle = () => {
    if (isManager) return "Mantenha a equipe organizada.";

    if (data.length === 0) return "Que tal planejar um descanso?";

    // Mostra a data do item mais recente
    if (data[0]?.startDate) {
      const date = new Date(data[0].startDate);
      // Formatação simples de dia/mês (ajuste +1 pois mês começa em 0)
      return `Próximo: ${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}`;
    }

    return "Acompanhe seus status.";
  };

  // --- Componentes Visuais ---

  const ListHeader = () => (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-400 font-medium text-sm">
            Bem-vindo(a),
          </Text>
          <Text className="text-2xl font-bold text-gray-800">
            {user?.name.split(" ")[0]}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="bg-gray-100 p-3 rounded-full border border-gray-200 active:bg-gray-200"
        >
          <Feather name="log-out" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Hero Card Dinâmico */}
      <View
        className={`w-full p-6 rounded-3xl ${primaryColor} shadow-lg ${shadowColor} mb-2`}
      >
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-white/80 font-medium mb-1">
              {isManager ? "Aguardando Análise" : "Status Recente"}
            </Text>
            {/* Texto Grande Dinâmico */}
            <Text className="text-4xl font-bold text-white">
              {getHeroStatus()}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-2xl">
            <Feather
              name={isManager ? "inbox" : "calendar"} // Mudei para calendar para reforçar a ideia de data
              size={24}
              color="#FFF"
            />
          </View>
        </View>
        {/* Subtítulo Dinâmico */}
        <Text className="text-white/60 text-xs mt-4 font-medium">
          {getHeroSubtitle()}
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-800 mt-6 mb-2 ml-1">
        {isManager ? "Solicitações Pendentes" : "Histórico de Férias"}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {loading && data.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isManager ? "#2563EB" : "#059669"}
          />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={isManager && item.status === "PENDING" ? 0.7 : 1}
              onPress={() => handleCardPress(item)}
            >
              <VacationCard item={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadData} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-10 opacity-50">
              <Feather name="clipboard" size={48} color="#9CA3AF" />
              <Text className="text-gray-400 text-center mt-4 font-medium">
                {isManager
                  ? "Tudo limpo por aqui!\nNenhuma pendência."
                  : "Você ainda não tem\nsolicitações registradas."}
              </Text>
            </View>
          }
        />
      )}

      {!isManager && (
        <View className="absolute bottom-8 right-6 shadow-xl shadow-emerald-500/40">
          <TouchableOpacity
            className="bg-emerald-600 flex-row items-center px-6 py-4 rounded-full"
            activeOpacity={0.8}
            onPress={() => navigation.navigate("NewVacation" as never)}
          >
            <Feather name="plus" size={24} color="#FFF" />
            <Text className="text-white font-bold ml-2 text-base">
              Nova Solicitação
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
