import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { db } from "@/config/firebase";
import {
  VacationRequest,
  VacationStatus,
  FirestoreVacationData,
} from "@/types";

const formatFirestoreDate = (
  dateField: FirebaseFirestoreTypes.Timestamp | string | null | undefined
): string => {
  if (!dateField) return new Date().toISOString();

  if (typeof dateField === "object" && "toDate" in dateField) {
    return dateField.toDate().toISOString();
  }

  if (typeof dateField === "string") {
    return dateField;
  }

  return new Date().toISOString();
};

const mapDocument = (
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot
): VacationRequest => {
  const data = doc.data() as FirestoreVacationData;

  return {
    id: doc.id,
    userId: data.userId || "",
    userName: data.userName || "",
    userAvatarId: data.userAvatarId ?? null,
    startDate: data.startDate || "",
    endDate: data.endDate || "",
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

export const managerService = {
  async getPendingRequests(): Promise<VacationRequest[]> {
    try {
      const snapshot = await db
        .collection("vacations")
        .where("status", "==", "PENDING")
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map(mapDocument);
    } catch (error) {
      console.error("Erro ao buscar solicitações pendentes:", error);
      throw error;
    }
  },

  async getManagerHistory(managerId: string): Promise<VacationRequest[]> {
    try {
      const snapshot = await db
        .collection("vacations")
        .where("managedBy", "==", managerId)
        .orderBy("updatedAt", "desc")
        .get();

      return snapshot.docs.map(mapDocument);
    } catch (error) {
      console.error("Erro ao buscar histórico do gestor:", error);
      throw error;
    }
  },

  async updateStatus(
    requestId: string,
    status: VacationStatus,
    managerId: string,
    managerName: string,
    managerObservation?: string,
    managerAvatarId?: number | null
  ): Promise<void> {
    try {
      const updatePromise = db
        .collection("vacations")
        .doc(requestId)
        .update({
          status,
          managedBy: managerId,
          managerName,
          managerObservation: managerObservation || "",
          managerAvatarId: managerAvatarId ?? null,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log(
            "⚠️ Timeout na aprovação: assumindo escrita offline (Cache)."
          );
          resolve();
        }, 2500);
      });

      await Promise.race([updatePromise, timeoutPromise]);
    } catch (error) {
      console.error("Erro ao atualizar status das férias:", error);
      throw error;
    }
  },
};
