import { authInstance, db } from "@/config/firebase";
import firestore from "@react-native-firebase/firestore";
import { UserRole } from "@/types";

const FIRST_NAMES_M = [
  "João",
  "Mateus",
  "Gabriel",
  "Lucas",
  "Ricardo",
  "André",
  "Felipe",
  "Bruno",
];
const FIRST_NAMES_F = [
  "Ana",
  "Beatriz",
  "Julia",
  "Fernanda",
  "Camila",
  "Larissa",
  "Patrícia",
  "Helena",
];
const LAST_NAMES = [
  "Silva",
  "Santos",
  "Oliveira",
  "Souza",
  "Pereira",
  "Lima",
  "Carvalho",
  "Ferreira",
  "Ribeiro",
  "Almeida",
];

export const seedService = {
  async run() {
    console.log("🚀 Iniciando Seed Nativo (Admin / Gestor / Colaborador)...");

    const operationalManagers: {
      id: string;
      name: string;
      avatarID: number;
    }[] = [];
    const usersToCreate: any[] = [];

    for (let i = 0; i < 10; i++) {
      const isMale = i < 5;
      const firstName = isMale
        ? FIRST_NAMES_M[Math.floor(Math.random() * FIRST_NAMES_M.length)]
        : FIRST_NAMES_F[Math.floor(Math.random() * FIRST_NAMES_F.length)];
      const lastName =
        LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}${i}@teste.com`;
      const avatarID = isMale
        ? Math.floor(Math.random() * 50) + 1
        : Math.floor(Math.random() * 50) + 51;

      let role: UserRole = "COLABORADOR";
      if (i === 0) role = "ADMIN";
      else if (i === 1 || i === 2) role = "GESTOR";

      usersToCreate.push({ fullName, email, role, avatarID });
    }

    for (const u of usersToCreate) {
      try {
        const cred = await authInstance.createUserWithEmailAndPassword(
          u.email,
          "123456"
        );
        const uid = cred.user.uid;

        await db.collection("users").doc(uid).set({
          name: u.fullName,
          email: u.email,
          role: u.role,
          avatarID: u.avatarID,
          accountStatus: "ACTIVE",

          createdAt: firestore.FieldValue.serverTimestamp(),
        });

        if (u.role === "GESTOR") {
          operationalManagers.push({
            id: uid,
            name: u.fullName,
            avatarID: u.avatarID,
          });
        }

        if (u.role === "COLABORADOR" && operationalManagers.length > 0) {
          await this.generateVacations(
            uid,
            u.fullName,
            u.avatarID,
            operationalManagers
          );
        }

        console.log(`✅ ${u.fullName} (${u.role}) criado.`);
      } catch (e: any) {
        console.error(`❌ Erro em ${u.email}:`, e.message);
      }
    }

    await authInstance.signOut();
    console.log("🏁 Seed finalizado!");
  },

  async generateVacations(
    uid: string,
    uName: string,
    uAvatar: number,
    operationalManagers: any[]
  ) {
    const years = [2023, 2024, 2025];
    const statusOptions = ["COMPLETED", "REJECTED"];

    for (const year of years) {
      const manager =
        operationalManagers[
          Math.floor(Math.random() * operationalManagers.length)
        ];
      const status =
        statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const month = Math.floor(Math.random() * 11);
      const day = Math.floor(Math.random() * 15) + 1;

      await db.collection("vacations").add({
        userId: uid,
        userName: uName,
        userAvatarId: uAvatar,
        managedBy: manager.id,
        managerName: manager.name,
        managerAvatarId: manager.avatarID,
        status: status,
        startDate: new Date(year, month, day).toISOString(),
        endDate: new Date(year, month, day + 15).toISOString(),

        createdAt: firestore.Timestamp.fromDate(new Date(year, month - 1, day)),
        updatedAt: firestore.Timestamp.fromDate(
          new Date(year, month - 1, day + 2)
        ),
        observation: "",
        managerObservation:
          status === "COMPLETED"
            ? "Aproveite o descanso!"
            : "Indisponibilidade por demanda.",
      });
    }

    const manager2026 =
      operationalManagers[
        Math.floor(Math.random() * operationalManagers.length)
      ];
    await db.collection("vacations").add({
      userId: uid,
      userName: uName,
      userAvatarId: uAvatar,
      managedBy: manager2026.id,
      managerName: manager2026.name,
      managerAvatarId: manager2026.avatarID,
      status: "APPROVED",
      startDate: new Date(2026, 5, 10).toISOString(),
      endDate: new Date(2026, 5, 25).toISOString(),
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      observation: "Viagem programada.",
      managerObservation: "Aprovado conforme solicitação.",
    });
  },
};
