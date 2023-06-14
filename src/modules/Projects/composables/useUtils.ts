/* eslint-disable @typescript-eslint/no-explicit-any */
import { HANSACRM3_URL } from 'src/conections/api_conectors';

export const setDefaultAvatar = (event: any) => {
  return (event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`);
};
