export default {
  name: 'Companies',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Empresas',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'companies',
      meta: {
        isComplete: true,
        nameLabel: 'Empresas',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Empresas',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
