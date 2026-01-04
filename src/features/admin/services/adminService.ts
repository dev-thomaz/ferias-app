import { db, authInstance } from "@/config/firebase";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { User } from "@/types";
import { VacationRequest, VacationStatus } from "@/features/vacations/types";

const formatFirestoreDate = (dateField: any): string => {
  if (!dateField) return new Date().toISOString();

  if (typeof dateField.toDate === "function") {
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

export const adminService = {
  async getPendingUsers(): Promise<PendingUser[]> {
    const snapshot = await db
      .collection("users")
      .where("accountStatus", "==", "WAITING_APPROVAL")
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatarID: data.avatarID ?? data.avatarId ?? null,
        accountStatus: data.accountStatus,
        createdAt: formatFirestoreDate(data.createdAt),
        isSyncing: doc.metadata.hasPendingWrites,
      } as PendingUser;
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
      let query: FirebaseFirestoreTypes.Query = db.collection("vacations");

      if (statusFilter !== "ALL") {
        query = query.where("status", "==", statusFilter);
      }

      const snapshot = await query.get();

      return snapshot.docs.map((doc) => {
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
      });
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
      const data = doc.data();

      const employee: User = {
        id: doc.id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "COLABORADOR",
        avatarID: data.avatarID ?? data.avatarId ?? null,
        accountStatus: data.accountStatus,
        isSyncing: doc.metadata.hasPendingWrites,
      };

      return employee;
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
