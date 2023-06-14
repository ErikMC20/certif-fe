export default {
  name: 'Opportunities',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Oportunidades',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'opportunities',
      meta: {
        isComplete: true,
        nameLabel: 'Opportunidades',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Oportunidades',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
