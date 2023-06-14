import { defineStore } from 'pinia';
import { axios_GLOBAL } from 'src/conections/axiosCRM';
export const useCommentsStore = defineStore('', {
  state: () => ({}),
  actions: {
    async getBeanComments(id: string) {
      try {
        const { data } = await axios_GLOBAL.get(`/related-comments-get/${id}`);
        return data.comments;
      } catch (error) {
        console.log(error);
      }
    },
  },
});
