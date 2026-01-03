import { db } from "@/config/firebase";
import { VacationConfig } from "../types";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export const configService = {
  async getVacationConfig(): Promise<VacationConfig> {
    const docRef = db.collection("config").doc("vacation_rules");

    const docSnap: FirebaseFirestoreTypes.DocumentSnapshot = await docRef.get();

    if (docSnap.exists()) {
      return docSnap.data() as VacationConfig;
    } else {
      const defaultConfig: VacationConfig = { allowConcurrentRequests: false };
      await docRef.set(defaultConfig);
      return defaultConfig;
    }
  },

  async updateVacationConfig(allowConcurrent: boolean): Promise<void> {
    await db
      .collection("config")
      .doc("vacation_rules")
      .set({ allowConcurrentRequests: allowConcurrent }, { merge: true });
  },
};
