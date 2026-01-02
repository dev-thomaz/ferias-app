import { db } from "@/config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { VacationRequest, CreateVacationDTO, VacationStatus } from "../types";

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

export const vacationService = {
  async createRequest(data: CreateVacationDTO): Promise<string> {
    const docRef = await addDoc(collection(db, "vacations"), {
      ...data,
      status: "PENDING",

      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async getUserVacations(userId: string): Promise<VacationRequest[]> {
    const q = query(
      collection(db, "vacations"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(mapDocument);
  },
};
