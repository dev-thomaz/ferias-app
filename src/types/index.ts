export type UserRole = "GESTOR" | "COLABORADOR" | "ADMIN";

export type VacationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type AccountStatus = "ACTIVE" | "DISABLED" | "WAITING_APPROVAL";
export interface VacationConfig {
  allowConcurrentRequests: boolean;
  adminCanManageVacations: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarID?: number | string | null;
  department?: string;
  admissionDate?: string;
  accountStatus?: AccountStatus;
  isSyncing?: boolean;
}

export interface CreateVacationDTO {
  userId: string;
  userName: string;
  userAvatarId?: number | string | null;
  startDate: string;
  endDate: string;
  observation?: string;
}

export interface VacationRequest {
  id: string;

  userId: string;
  userName: string;
  userAvatarId?: number | string | null;

  startDate: string;
  endDate: string;
  observation?: string;
  status: VacationStatus;

  createdAt: string;
  updatedAt?: string;

  managedBy?: string;
  managerName?: string;
  managerAvatarId?: number | string | null;
  managerObservation?: string;
}
