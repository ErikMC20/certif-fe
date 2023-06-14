export default {
  name: 'Contacts',
  component: () =>
    import(
      /* webpackChunkName: "contacts" */ '../../../layouts/HomeLayout.vue'
    ),
  meta: {
    nameLabel: 'Contactos',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'contacts',
      meta: {
        isComplete: true,
        nameLabel: 'Contactos',
      },
      component: () => import('../pages/viewList/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Contactos',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
