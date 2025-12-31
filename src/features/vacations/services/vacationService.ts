import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

export interface VacationRequest {
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  observation?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: any;
  managedBy?: string;
  managerObservation?: string;
  updatedAt?: string;
}

export const vacationService = {
  async createRequest(data: Omit<VacationRequest, "createdAt" | "status">) {
    try {
      const docRef = await addDoc(collection(db, "vacations"), {
        ...data,
        status: "PENDING",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao salvar férias:", error);
      throw error;
    }
  },

  async getUserVacations(userId: string) {
    const q = query(
      collection(db, "vacations"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getPendingRequests() {
    const q = query(
      collection(db, "vacations"),
      where("status", "==", "PENDING"),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async updateStatus(
    requestId: string,
    status: "APPROVED" | "REJECTED",
    managerId: string,
    managerObservation?: string
  ) {
    const docRef = doc(db, "vacations", requestId);
    await updateDoc(docRef, {
      status,
      managedBy: managerId,
      managerObservation,
      updatedAt: new Date().toISOString(),
    });
  },
};
