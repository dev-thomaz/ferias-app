import { auth, db } from "@/config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { UserRole } from "../store/useAuthStore";

export const authService = {
  async login(email: string, pass: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const { uid } = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      throw new Error("Perfil não encontrado.");
    }

    const data = userDoc.data();

    return {
      id: uid,
      email,
      name: data.name,
      role: data.role,

      avatarID: data.avatarID ?? data.avatarId ?? null,
    };
  },

  async register(email: string, pass: string, name: string, role: UserRole) {
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
      avatarID: null,
    };

    await setDoc(doc(db, "users", uid), userData);

    return { id: uid, ...userData };
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
    ];

    for (const u of users) {
      try {
        await this.register(u.email, u.pass, u.name, u.role as UserRole);
      } catch (e) {}
    }
  },
};
