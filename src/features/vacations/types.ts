export type VacationStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

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
  managerObservation?: string;

  managerAvatarId?: string | number | null;
  isSyncing?: boolean;
}

export type CreateVacationDTO = Omit<
  VacationRequest,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "managedBy"
  | "managerName"
  | "managerObservation"
  | "managerAvatarId"
>;

export interface VacationConfig {
  allowConcurrentRequests: boolean;
  adminCanManageVacations: boolean;
}
