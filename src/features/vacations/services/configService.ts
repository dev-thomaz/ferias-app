import { db } from "@/config/firebase";
import { VacationConfig } from "@/features/vacations/types";

export const configService = {
  async getVacationConfig(): Promise<VacationConfig> {
    const docRef = db.collection("config").doc("vacation_rules");

    try {
      const docSnap = await docRef.get();

      if (docSnap.exists()) {
        return docSnap.data() as VacationConfig;
      }

      return { allowConcurrentRequests: false, adminCanManageVacations: true };
    } catch (error) {
      return { allowConcurrentRequests: false, adminCanManageVacations: true };
    }
  },

  async updateVacationConfig(updates: Partial<VacationConfig>): Promise<void> {
    await db
      .collection("config")
      .doc("vacation_rules")
      .set(updates, { merge: true });
  },
};
