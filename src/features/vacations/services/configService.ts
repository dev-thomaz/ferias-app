import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { VacationConfig } from "../types";

export const configService = {
  async getVacationConfig(): Promise<VacationConfig> {
    const docRef = doc(db, "config", "vacation_rules");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as VacationConfig;
    } else {
      const defaultConfig: VacationConfig = { allowConcurrentRequests: false };
      await setDoc(docRef, defaultConfig);
      return defaultConfig;
    }
  },

  async updateVacationConfig(allowConcurrent: boolean): Promise<void> {
    const docRef = doc(db, "config", "vacation_rules");
    await setDoc(
      docRef,
      { allowConcurrentRequests: allowConcurrent },
      { merge: true }
    );
  },
};
