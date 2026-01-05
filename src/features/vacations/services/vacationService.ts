import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { db } from "@/config/firebase";
import {
  VacationRequest,
  CreateVacationDTO,
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

export const vacationService = {
  async createRequest(data: CreateVacationDTO): Promise<string> {
    try {
      const docRef = db.collection("vacations").doc();

      const payload = {
        ...data,
        status: "PENDING",
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log("⚠️ Timeout de rede: assumindo escrita offline (Cache).");
          resolve();
        }, 2500);
      });

      await Promise.race([docRef.set(payload), timeoutPromise]);

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
