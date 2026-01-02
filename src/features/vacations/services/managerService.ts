import { db } from "@/config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { VacationRequest, VacationStatus } from "../types";

const mapDocument = (
  doc: QueryDocumentSnapshot<DocumentData>
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

    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,

    updatedAt: data.updatedAt,
    managedBy: data.managedBy,
    managerName: data.managerName,
    managerAvatarId: data.managerAvatarId,
    managerObservation: data.managerObservation,
  };
};

export const managerService = {
  async getPendingRequests(): Promise<VacationRequest[]> {
    const q = query(
      collection(db, "vacations"),
      where("status", "==", "PENDING"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(mapDocument);
  },

  async getManagerHistory(managerId: string): Promise<VacationRequest[]> {
    const q = query(
      collection(db, "vacations"),
      where("managedBy", "==", managerId),
      orderBy("updatedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocument);
  },

  async updateStatus(
    requestId: string,
    status: VacationStatus,
    managerId: string,
    managerName: string,
    managerObservation?: string,
    managerAvatarId?: string | number
  ): Promise<void> {
    const docRef = doc(db, "vacations", requestId);
    await updateDoc(docRef, {
      status,
      managedBy: managerId,
      managerName,
      managerObservation,
      managerAvatarId,
      updatedAt: new Date().toISOString(),
    });
  },
};
