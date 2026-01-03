import { db } from "@/config/firebase";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { VacationRequest, VacationStatus } from "../types";

const formatFirestoreDate = (dateField: any): string => {
  if (!dateField) return new Date().toISOString();
  if (typeof dateField.toDate === "function")
    return dateField.toDate().toISOString();
  if (typeof dateField === "string") return dateField;
  return new Date().toISOString();
};

const mapDocument = (
  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot
): VacationRequest => {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    userName: data.userName,
    userAvatarId: data.userAvatarId,
    startDate: data.startDate,
    endDate: data.endDate,
    observation: data.observation,
    status: data.status as VacationStatus,

    createdAt: formatFirestoreDate(data.createdAt),
    updatedAt: formatFirestoreDate(data.updatedAt),

    managedBy: data.managedBy,
    managerName: data.managerName,
    managerAvatarId: data.managerAvatarId,
    managerObservation: data.managerObservation,

    isSyncing: doc.metadata.hasPendingWrites,
  };
};

export const managerService = {
  async getPendingRequests(): Promise<VacationRequest[]> {
    const snapshot = await db
      .collection("vacations")
      .where("status", "==", "PENDING")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(mapDocument);
  },

  async getManagerHistory(managerId: string): Promise<VacationRequest[]> {
    const snapshot = await db
      .collection("vacations")
      .where("managedBy", "==", managerId)
      .orderBy("updatedAt", "desc")
      .get();

    return snapshot.docs.map(mapDocument);
  },

  async updateStatus(
    requestId: string,
    status: VacationStatus,
    managerId: string,
    managerName: string,
    managerObservation?: string,
    managerAvatarId?: string | number
  ): Promise<void> {
    try {
      await db.collection("vacations").doc(requestId).update({
        status,
        managedBy: managerId,
        managerName,
        managerObservation,
        managerAvatarId,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar status das férias:", error);
      throw error;
    }
  },
};
