import { db } from "@/config/firebase";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { VacationRequest, CreateVacationDTO, VacationStatus } from "../types";

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

export const vacationService = {
  async createRequest(data: CreateVacationDTO): Promise<string> {
    try {
      const docRef = await db.collection("vacations").add({
        ...data,
        status: "PENDING",
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      throw error;
    }
  },

  subscribeUserVacations(
    userId: string,
    onUpdate: (vacations: VacationRequest[]) => void
  ) {
    return db
      .collection("vacations")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (querySnapshot) => {
          if (!querySnapshot) return;
          const vacations = querySnapshot.docs.map(mapDocument);
          onUpdate(vacations);
        },
        (error) => {
          console.error("Erro no subscription de férias:", error);
        }
      );
  },

  async getUserVacations(userId: string): Promise<VacationRequest[]> {
    try {
      const snapshot = await db
        .collection("vacations")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get();

      return snapshot.docs.map(mapDocument);
    } catch (error) {
      console.error("Erro ao buscar férias do usuário:", error);
      throw error;
    }
  },
};
