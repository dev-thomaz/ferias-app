import { auth, db } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserRole } from "../store/useAuthStore";

export type AccountStatus = "ACTIVE" | "WAITING_APPROVAL" | "DISABLED";

export const authService = {
  async login(email: string, pass: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const { uid } = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      await signOut(auth);
      throw new Error("USER_NOT_FOUND");
    }

    const data = userDoc.data();

    if (data.accountStatus === "WAITING_APPROVAL") {
      throw new Error("ACCOUNT_PENDING");
    }

    if (data.accountStatus === "DISABLED") {
      throw new Error("ACCOUNT_DISABLED");
    }

    return {
      id: uid,
      email,
      name: data.name,
      role: data.role as UserRole,
      avatarID: data.avatarID ?? data.avatarId ?? null,
    };
  },

  async register(
    name: string,
    email: string,
    pass: string,
    role: UserRole,
    avatarID: number | null
  ) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
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
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", uid), userData);

    await signOut(auth);
  },

  async logout() {
    await signOut(auth);
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
        const cred = await createUserWithEmailAndPassword(
          auth,
          u.email,
          u.pass
        );

        await setDoc(doc(db, "users", cred.user.uid), {
          name: u.name,
          email: u.email,
          role: u.role,
          accountStatus: "ACTIVE",
          avatarID: Math.floor(Math.random() * 70) + 1,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.log(`Usuário ${u.email} já existe ou erro:`, e);
      }
    }
  },
};
