import { useState, useEffect, useMemo } from "react";
import { LayoutAnimation } from "react-native";
import { db } from "@/config/firebase";
import { VacationRequest, VacationStatus } from "../types";
import { DialogVariant } from "@/components/Dialog";

type TabType = "PENDING" | "HISTORY";

const formatFirestoreDate = (dateField: any): string => {
  if (!dateField) return new Date().toISOString();
  if (typeof dateField.toDate === "function")
    return dateField.toDate().toISOString();
  if (typeof dateField === "string") return dateField;
  return new Date().toISOString();
};

const mapDocument = (doc: any): VacationRequest => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: formatFirestoreDate(data.createdAt),
    updatedAt: formatFirestoreDate(data.updatedAt),
    isSyncing: doc.metadata.hasPendingWrites,
  };
};

export function useManagerVacations(userId: string) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dialog, setDialog] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as DialogVariant,
  });

  useEffect(() => {
    setLoading(true);

    let query = db.collection("vacations");

    if (activeTab === "PENDING") {
      query = query.where("status", "==", "PENDING") as any;
    } else {
      query = query.where("managedBy", "==", userId) as any;
    }

    const unsubscribe = query
      .orderBy(activeTab === "PENDING" ? "createdAt" : "updatedAt", "desc")
      .onSnapshot(
        (snapshot) => {
          const mappedData = snapshot.docs.map(mapDocument);
          setData(mappedData);
          setLoading(false);
        },
        (error) => {
          console.error("Erro no listener do Gestor:", error);
          setDialog({
            visible: true,
            title: "Erro de Conexão",
            message: "Não foi possível sincronizar os dados.",
            variant: "error",
          });
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [activeTab, userId]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.isSyncing && !b.isSyncing) return -1;
      if (!a.isSyncing && b.isSyncing) return 1;

      const dateA = new Date(
        activeTab === "PENDING" ? a.createdAt : a.updatedAt!
      ).getTime();
      const dateB = new Date(
        activeTab === "PENDING" ? b.createdAt : b.updatedAt!
      ).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [data, sortOrder, activeTab]);

  const toggleSort = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const changeTab = (tab: TabType) => {
    LayoutAnimation.easeInEaseOut();
    setActiveTab(tab);
  };

  return {
    loading,
    activeTab,
    sortedData,
    sortOrder,
    dialog,
    setDialog,
    toggleSort,
    changeTab,
    loadData: () => {},
    totalCount: data.length,
  };
}
