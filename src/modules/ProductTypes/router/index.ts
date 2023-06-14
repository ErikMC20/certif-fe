export default {
  name: 'ProductTypes',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Tipo de Producto',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'productTypes',
      meta: {
        isComplete: true,
        nameLabel: 'Tipos de Producto',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'ProductTypes',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
