import { HANSACRM3_URL } from 'src/conections/api_conectors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setDefaultAvatar = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};
