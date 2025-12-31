export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  NewVacation: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
