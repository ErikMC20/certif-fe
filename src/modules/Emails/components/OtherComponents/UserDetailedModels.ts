type UserState = 'Activo' | 'Inactivo';

export interface UserDetails {
  id: number;
  imageSource: string;
  name: string;
  marketArea: string;
  occupation: string;
  userState: UserState;
  principal: boolean;
}
