import { db, authInstance } from "@/config/firebase";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import {
  User,
  VacationRequest,
  VacationStatus,
  FirestoreVacationData,
  FirestoreUserData,
  UserRole,
  AccountStatus,
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

export interface PendingUser extends User {
  createdAt: string;
}

const mapVacationDocument = (
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

export const adminService = {
  async getPendingUsers(): Promise<PendingUser[]> {
    const snapshot = await db
      .collection("users")
      .where("accountStatus", "==", "WAITING_APPROVAL")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreUserData;
      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: (data.role as UserRole) || "COLABORADOR",
        avatarID: data.avatarID ?? data.avatarId ?? null,
        accountStatus:
          (data.accountStatus as AccountStatus) || "WAITING_APPROVAL",
        createdAt: formatFirestoreDate(data.createdAt),
        isSyncing: doc.metadata.hasPendingWrites,
      };
    });
  },

  async approveUser(userId: string) {
    await db.collection("users").doc(userId).update({
      accountStatus: "ACTIVE",
    });
  },

  async rejectUser(userId: string) {
    await db.collection("users").doc(userId).update({
      accountStatus: "DISABLED",
    });
  },

  async getAllVacations(
    statusFilter: string = "ALL"
  ): Promise<VacationRequest[]> {
    try {
      let query: FirebaseFirestoreTypes.Query = db
        .collection("vacations")
        .orderBy("createdAt", "desc");

      if (statusFilter !== "ALL") {
        query = query.where("status", "==", statusFilter);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(mapVacationDocument);
    } catch (error) {
      console.error("Erro ao buscar todas as férias:", error);
      throw error;
    }
  },

  async getAllEmployees(): Promise<User[]> {
    const snapshot = await db
      .collection("users")
      .where("accountStatus", "in", ["ACTIVE", "DISABLED"])
      .orderBy("name", "asc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreUserData;

      return {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: (data.role as UserRole) || "COLABORADOR",
        avatarID: data.avatarID ?? data.avatarId ?? null,
        accountStatus: (data.accountStatus as AccountStatus) || "DISABLED",
        isSyncing: doc.metadata.hasPendingWrites,
      };
    });
  },

  async updateUserStatus(
    userId: string,
    newStatus: "ACTIVE" | "DISABLED"
  ): Promise<void> {
    await db.collection("users").doc(userId).update({
      accountStatus: newStatus,
    });
  },

  async disableUser(userId: string): Promise<void> {
    await db.collection("users").doc(userId).update({
      accountStatus: "DISABLED",
    });
  },

  async resetUserPassword(email: string): Promise<void> {
    await authInstance.sendPasswordResetEmail(email);
  },
};
