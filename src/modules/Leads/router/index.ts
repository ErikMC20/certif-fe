export default {
  name: 'Leads',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Leads',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'leads',
      meta: {
        isComplete: true,
        nameLabel: 'Leads',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Leads',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
