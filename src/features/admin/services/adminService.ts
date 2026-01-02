import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { User } from "@/features/auth/store/useAuthStore";
import { VacationRequest } from "@/features/vacations/types";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
export interface PendingUser extends User {
  createdAt: string;
}

export const adminService = {
  async getPendingUsers(): Promise<PendingUser[]> {
    const q = query(
      collection(db, "users"),
      where("accountStatus", "==", "WAITING_APPROVAL"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const users: PendingUser[] = [];

    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as PendingUser);
    });

    return users;
  },

  async approveUser(userId: string) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      accountStatus: "ACTIVE",
    });
  },

  async rejectUser(userId: string) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      accountStatus: "DISABLED",
    });
  },

  async getAllVacations(): Promise<VacationRequest[]> {
    try {
      const q = query(
        collection(db, "vacations"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const vacations: VacationRequest[] = [];

      querySnapshot.forEach((doc) => {
        vacations.push({ id: doc.id, ...doc.data() } as VacationRequest);
      });

      return vacations;
    } catch (error) {
      console.error("Erro ao buscar todas as férias:", error);
      throw error;
    }
  },

  async getAllEmployees(): Promise<User[]> {
    const q = query(
      collection(db, "users"),
      where("accountStatus", "in", ["ACTIVE", "DISABLED"]),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
  },

  async updateUserStatus(
    userId: string,
    newStatus: "ACTIVE" | "DISABLED"
  ): Promise<void> {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      accountStatus: newStatus,
    });
  },

  async disableUser(userId: string): Promise<void> {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      accountStatus: "DISABLED",
    });
  },
  async resetUserPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },
};
