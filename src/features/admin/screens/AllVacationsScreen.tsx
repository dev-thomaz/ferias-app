import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { adminService } from "@/features/admin/services/adminService";

import { VacationRequest, VacationStatus } from "@/features/vacations/types";
import { translateStatusFilter } from "@/utils/textUtils";
import { VacationCard } from "@/features/vacations/components/VacationCard";
import { Dialog, DialogVariant } from "@/components/Dialog";

type FilterType = "ALL" | VacationStatus;

export function AllVacationsScreen() {
  const navigation = useNavigation();

  const [data, setData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAllVacations();
      setData(result);
    } catch (error) {
      setDialog({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar o histórico geral.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const filteredData = useMemo(() => {
    if (activeFilter === "ALL") return data;
    return data.filter((item) => item.status === activeFilter);
  }, [data, activeFilter]);

  const FilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="pl-6 mb-4 mt-2"
      contentContainerStyle={{ paddingRight: 24 }}
    >
      {[
        { id: "ALL", label: "Todos" },
        { id: "PENDING", label: "Pendentes" },
        { id: "APPROVED", label: "Aprovados" },
        { id: "REJECTED", label: "Reprovados" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => setActiveFilter(tab.id as FilterType)}
          className={`mr-3 px-4 py-2 rounded-full border ${
            activeFilter === tab.id
              ? "bg-purple-600 border-purple-600"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-bold text-xs ${
              activeFilter === tab.id ? "text-white" : "text-gray-600"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-6 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Feather name="arrow-left" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Auditoria de Férias
          </Text>
        </View>
        <View className="bg-purple-100 px-3 py-1 rounded-full">
          <Text className="text-purple-700 font-bold text-xs">
            {data.length} Total
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <FilterTabs />
      </View>

      {loading && data.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#9333EA" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-6">
              <VacationCard
                item={item}
                onPress={() =>
                  navigation.navigate("VacationDetails", { request: item })
                }
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadData}
              colors={["#9333EA"]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12 opacity-50 px-6">
              <Feather
                name={activeFilter === "ALL" ? "clipboard" : "filter"}
                size={48}
                color="#9CA3AF"
              />
              <Text className="text-gray-400 text-center mt-4 font-medium leading-relaxed">
                {activeFilter === "ALL"
                  ? "Nenhuma solicitação registrada\nno sistema ainda."
                  : `Nenhum registro encontrado\nno filtro "${translateStatusFilter(
                      activeFilter
                    )}".`}
              </Text>
            </View>
          }
        />
      )}

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
