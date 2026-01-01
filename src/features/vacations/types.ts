export type VacationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface VacationRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatarId?: string | number;
  startDate: string;
  endDate: string;

  observation?: string;
  status: VacationStatus;

  createdAt: string;
  updatedAt?: string;

  managedBy?: string;
  managerName?: string;
  managerObservation?: string;
  managerAvatarId?: string | number;
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
>;

export interface VacationConfig {
  allowConcurrentRequests: boolean;
}
