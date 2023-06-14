export default {
  name: 'Businesses',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Negociaciones',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'businesses',
      meta: {
        isComplete: true,
        nameLabel: 'Negociaciones',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Businesses',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
