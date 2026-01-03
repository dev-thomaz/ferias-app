import { authInstance, db } from "@/config/firebase";
import firestore from "@react-native-firebase/firestore";
import { User, UserRole } from "@/types";

export type AccountStatus = "ACTIVE" | "WAITING_APPROVAL" | "DISABLED";

export const authService = {
  async login(email: string, pass: string) {
    const userCredential = await authInstance.signInWithEmailAndPassword(
      email,
      pass
    );
    const { uid } = userCredential.user;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists()) {
      await authInstance.signOut();
      throw new Error("USER_NOT_FOUND");
    }

    const data = userDoc.data();

    if (data?.accountStatus === "WAITING_APPROVAL") {
      throw new Error("ACCOUNT_PENDING");
    }

    if (data?.accountStatus === "DISABLED") {
      throw new Error("ACCOUNT_DISABLED");
    }

    return {
      id: uid,
      email,
      name: data?.name,
      role: data?.role as UserRole,
      avatarID: data?.avatarID ?? data?.avatarId ?? null,
    };
  },

  async register(
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    avatarID: number | null
  ) {
    const userCredential = await authInstance.createUserWithEmailAndPassword(
      email,
      pass
    );
    const { uid } = userCredential.user;

    const userData = {
      name,
      email,
      role,
      accountStatus: "WAITING_APPROVAL" as AccountStatus,
      avatarID: avatarID,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("users").doc(uid).set(userData);

    await authInstance.signOut();
  },

  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await db.collection("users").doc(uid).get();

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();

      if (userData?.accountStatus && userData.accountStatus !== "ACTIVE") {
        throw new Error("ACCOUNT_BLOCKED");
      }

      return {
        id: uid,
        email: userData?.email || "",
        name: userData?.name || "Usuário",
        role: userData?.role as UserRole,
        avatarID: userData?.avatarID ?? userData?.avatarId ?? null,
      };
    } catch (error) {
      console.error("Erro ao recuperar perfil do usuário:", error);
      throw error;
    }
  },

  async logout() {
    await authInstance.signOut();
  },

  async seedUsers() {
    const users = [
      {
        email: "colab@teste.com",
        pass: "123456",
        name: "Carlos Colaborador",
        role: "COLABORADOR",
      },
      {
        email: "gestor@teste.com",
        pass: "123456",
        name: "Gisele Gestora",
        role: "GESTOR",
      },
      {
        email: "admin@teste.com",
        pass: "123456",
        name: "Arnoldo Admin",
        role: "ADMIN",
      },
    ];

    for (const u of users) {
      try {
        const cred = await authInstance.createUserWithEmailAndPassword(
          u.email,
          u.pass
        );

        await db
          .collection("users")
          .doc(cred.user.uid)
          .set({
            name: u.name,
            email: u.email,
            role: u.role,
            accountStatus: "ACTIVE",
            avatarID: Math.floor(Math.random() * 70) + 1,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
        console.log(`Usuário ${u.name} criado!`);
      } catch (e) {
        console.log(`Usuário ${u.email} já existe ou erro:`, e);
      }
    }
  },
};
