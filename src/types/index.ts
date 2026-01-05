import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type UserRole = "GESTOR" | "COLABORADOR" | "ADMIN";

export type AccountStatus = "ACTIVE" | "DISABLED" | "WAITING_APPROVAL";

export type VacationStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

export type DialogVariant = "success" | "error" | "info" | "warning";

export interface VacationConfig {
  allowConcurrentRequests: boolean;
  adminCanManageVacations: boolean;
  minDaysNotice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarID?: string | number | null;
  department?: string;
  admissionDate?: string;
  accountStatus?: AccountStatus;

  isSyncing?: boolean;
}

export interface FirestoreVacationData {
  userId: string;
  userName: string;
  userAvatarId?: number | null;
  startDate: string;
  endDate: string;
  observation?: string;
  status: string;

  createdAt?: FirebaseFirestoreTypes.Timestamp | null;
  updatedAt?: FirebaseFirestoreTypes.Timestamp | null;

  managedBy?: string | null;
  managerName?: string | null;
  managerAvatarId?: number | null;
  managerObservation?: string | null;
}

export interface FirestoreUserData {
  name: string;
  email: string;
  role: string;
  avatarID?: number | null;
  avatarId?: number | null;
  accountStatus: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp | null;
}

export interface DialogState {
  visible: boolean;
  title: string;
  message: string;
  variant: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface VacationRequest {
  id: string;

  userId: string;
  userName: string;
  userAvatarId?: string | number | null;

  startDate: string;
  endDate: string;
  observation?: string;
  status: VacationStatus;

  createdAt: string;
  updatedAt?: string;

  managedBy?: string;
  managerName?: string;
  managerAvatarId?: string | number | null;
  managerObservation?: string;

  isSyncing?: boolean;
}

export interface CreateVacationDTO {
  userId: string;
  userName: string;
  userAvatarId?: string | number | null;
  startDate: string;
  endDate: string;
  observation?: string;
}
