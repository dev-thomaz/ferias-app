import { useState, useEffect, useCallback } from "react";
import { LayoutAnimation } from "react-native";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { db } from "@/config/firebase";
import {
  VacationRequest,
  DialogState,
  FirestoreVacationData,
  VacationStatus,
} from "@/types";

type TabType = "PENDING" | "HISTORY";

const formatFirestoreDate = (
  dateField: FirebaseFirestoreTypes.Timestamp | string | null | undefined
): string => {
  if (!dateField) return new Date().toISOString();

  if (typeof dateField === "object") {
    if ("toDate" in dateField && typeof dateField.toDate === "function") {
      return dateField.toDate().toISOString();
    }

    return new Date().toISOString();
  }

  if (typeof dateField === "string") return dateField;

  return new Date().toISOString();
};

const mapDocument = (
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot
): VacationRequest => {
  const data = doc.data() as FirestoreVacationData;

  return {
    id: doc.id,
    userId: data.userId || "",
    userName: data.userName || "Usuário",
    userAvatarId: data.userAvatarId ?? null,
    startDate: data.startDate || new Date().toISOString(),
    endDate: data.endDate || new Date().toISOString(),
    observation: data.observation || "",
    status: (data.status as VacationStatus) || "PENDING",
    createdAt: formatFirestoreDate(data.createdAt),
    updatedAt: formatFirestoreDate(data.updatedAt),
    managedBy: data.managedBy || undefined,
    managerName: data.managerName || undefined,
    managerAvatarId: data.managerAvatarId || undefined,
    managerObservation: data.managerObservation || undefined,
    isSyncing: doc.metadata.hasPendingWrites,
  };
};

export function useManagerVacations(userId: string) {
  const [data, setData] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("PENDING");

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    title: "",
    message: "",
    variant: "info",
  });

  useEffect(() => {
    setLoading(true);

    let query: FirebaseFirestoreTypes.Query = db.collection("vacations");

    if (activeTab === "PENDING") {
      query = query.where("status", "==", "PENDING");

      query = query.orderBy("createdAt", "desc");
    } else {
      query = query.where("managedBy", "==", userId);

      query = query.orderBy("updatedAt", "desc");
    }

    const unsubscribe = query.onSnapshot(
      { includeMetadataChanges: true },
      (snapshot) => {
        const mappedData = snapshot.docs.map(mapDocument);
        setData(mappedData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro no listener do Gestor:", error);

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeTab, userId]);

  const changeTab = (tab: TabType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tab);
  };

  const closeDialog = () => setDialog((prev) => ({ ...prev, visible: false }));

  const loadData = useCallback(async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
  }, []);

  return {
    loading,
    activeTab,
    sortedData: data,
    dialog,
    setDialog,
    changeTab,
    closeDialog,
    totalCount: data.length,
    loadData,
  };
}
