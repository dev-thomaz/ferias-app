import { VacationRequest } from "../features/vacations/services/vacationService";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NewVacation: undefined;

  VacationDetails: { request: VacationRequest & { id: string } };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
