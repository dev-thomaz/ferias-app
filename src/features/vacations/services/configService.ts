import { db } from "@/config/firebase";
import { VacationConfig } from "@/features/vacations/types";

export const configService = {
  async getVacationConfig(): Promise<VacationConfig> {
    try {
      const docRef = db.collection("config").doc("vacation_rules");
      const docSnap = await docRef.get();

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          allowConcurrentRequests: data?.allowConcurrentRequests ?? false,
        };
      } else {
        const defaultConfig: VacationConfig = {
          allowConcurrentRequests: false,
        };
        await docRef.set(defaultConfig);
        return defaultConfig;
      }
    } catch (error) {
      console.error("Erro ao buscar config:", error);
      return { allowConcurrentRequests: false };
    }
  },

  async updateVacationConfig(allowConcurrent: boolean): Promise<void> {
    await db
      .collection("config")
      .doc("vacation_rules")
      .set({ allowConcurrentRequests: allowConcurrent }, { merge: true });
  },
};
