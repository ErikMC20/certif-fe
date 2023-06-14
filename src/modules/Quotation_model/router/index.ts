export default {
  name: 'Quotationmodel',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Modelo de Cotización',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'quotationmodel',
      meta: {
        isComplete: true,
        nameLabel: 'Modelo de Cotización',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Modelo de Cotización',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
