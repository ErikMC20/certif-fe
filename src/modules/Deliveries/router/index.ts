export default {
  name: 'Deliveries',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Entregas',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'deliveries',
      meta: {
        isComplete: true,
        nameLabel: 'Entregas',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Deliveries',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
