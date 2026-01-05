import { db } from "@/config/firebase";
import { VacationConfig } from "@/types";

export const configService = {
  async getVacationConfig(): Promise<VacationConfig> {
    const docRef = db.collection("config").doc("vacation_rules");

    try {
      const docSnap = await docRef.get();

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          allowConcurrentRequests: data?.allowConcurrentRequests ?? false,
          adminCanManageVacations: data?.adminCanManageVacations ?? true,
          minDaysNotice: data?.minDaysNotice ?? 1,
        };
      }

      return {
        allowConcurrentRequests: false,
        adminCanManageVacations: true,
        minDaysNotice: 1,
      };
    } catch (error) {
      console.error("Erro ao buscar config:", error);
      return {
        allowConcurrentRequests: false,
        adminCanManageVacations: true,
        minDaysNotice: 1,
      };
    }
  },

  async updateVacationConfig(updates: Partial<VacationConfig>): Promise<void> {
    await db
      .collection("config")
      .doc("vacation_rules")
      .set(updates, { merge: true });
  },
};
