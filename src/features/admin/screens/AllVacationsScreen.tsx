import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  StatusBar,
} from "react-native";

import { ArrowLeft, ClipboardList, Filter } from "lucide-react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useColorScheme } from "nativewind";

import { adminService } from "@/features/admin/services/adminService";
import { VacationRequest, VacationStatus } from "@/features/vacations/types";
import { translateStatusFilter } from "@/utils/textUtils";
import { VacationCard } from "@/features/vacations/components/VacationCard";
import { Dialog, DialogVariant } from "@/components/Dialog";

type FilterType = "ALL" | VacationStatus;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "ALL", label: "Todos" },
  { id: "PENDING", label: "Pendentes" },
  { id: "APPROVED", label: "Aprovados" },
  { id: "COMPLETED", label: "Concluídos" },
  { id: "REJECTED", label: "Reprovados" },
];

export function AllVacationsScreen() {
  const navigation = useNavigation<any>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

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
        message: "Não foi possível carregar o histórico.",
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

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-surface-light dark:bg-surface-dark pt-12 pb-4 px-6 border-b border-gray-100 dark:border-gray-800 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8, marginLeft: -8, borderRadius: 99 }}
          >
            <ArrowLeft size={24} color={isDark ? "#F3F4F6" : "#374151"} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 dark:text-gray-100 ml-2">
            Auditoria Geral
          </Text>
        </View>
        <View className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800/50">
          <Text className="text-purple-700 dark:text-purple-300 font-bold text-[10px] uppercase">
            {data.length} Total
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 24, marginBottom: 16, marginTop: 8 }}
          contentContainerStyle={{ paddingRight: 48 }}
        >
          {FILTERS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveFilter(tab.id)}
              style={{
                marginRight: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 99,
                borderWidth: 1,
                backgroundColor:
                  activeFilter === tab.id
                    ? "#9333EA"
                    : isDark
                    ? "#1E293B"
                    : "#FFFFFF",
                borderColor:
                  activeFilter === tab.id
                    ? "#9333EA"
                    : isDark
                    ? "#334155"
                    : "#E2E8F0",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  color:
                    activeFilter === tab.id
                      ? "#FFFFFF"
                      : isDark
                      ? "#94A3B8"
                      : "#4B5563",
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
              tintColor={isDark ? "#FFF" : "#9333EA"}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20 opacity-50 px-6">
              {activeFilter === "ALL" ? (
                <ClipboardList
                  size={48}
                  color={isDark ? "#4B5563" : "#9CA3AF"}
                />
              ) : (
                <Filter size={48} color={isDark ? "#4B5563" : "#9CA3AF"} />
              )}

              <Text className="text-gray-400 dark:text-gray-500 text-center font-bold mt-4">
                {activeFilter === "ALL"
                  ? "Nenhuma solicitação no sistema."
                  : `Nenhum registro para "${translateStatusFilter(
                      activeFilter as any
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
