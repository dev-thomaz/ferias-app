export enum UserRole {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  admissionDate: string;
  department?: string;
}

export interface VacationRequest {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
}
