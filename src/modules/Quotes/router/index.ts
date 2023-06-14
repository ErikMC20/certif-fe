export default {
  name: 'Quotes',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Cotizaciones',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'quotes',
      meta: {
        isComplete: true,
        nameLabel: 'Cotizaciones',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Cotizaciones',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
