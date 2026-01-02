import { VacationRequest } from "@/features/vacations/types";

export type RootStackParamList = {
  Login: undefined;

  Home: undefined;
  NewVacation: undefined;
  VacationDetails: { request: VacationRequest };
  UserApproval: undefined;
  AllVacations: undefined;
  EmployeesList: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
