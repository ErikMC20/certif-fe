export default {
  name: 'Reservas',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Reservas',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'reservas',
      meta: {
        isComplete: true,
        nameLabel: 'Reservas',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Reservas',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
