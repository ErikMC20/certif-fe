//import { property } from './models';
import { userStore } from 'src/modules/Users/store/UserStore';
import templateStore from 'src/stores/template/templateStore';
const user = userStore();
const template = templateStore();

export const userComposable = () => {
  return {
    user,
    template,
  };
};
