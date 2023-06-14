export default {
  path: '/assignment',
  component: () => import('src/layouts/HomeLayout2.vue'),
  meta: {
    nameLabel: '',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'assignment',
      meta: {
        isComplete: true,
        nameLabel: '',
      },
      component: () => import('../views/ViewMyList.vue'),
      props: (route: { query: { iduser: string } }) => {
        return {
          idUser: route.query.iduser,
        };
      },
    },
  ],
};
