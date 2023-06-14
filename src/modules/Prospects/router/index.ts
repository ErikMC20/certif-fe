export default {
  name: 'Prospects',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Prospectos',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'prospects',
      meta: {
        isComplete: true,
        nameLabel: 'Prospectos',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Prospectos',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
