export default {
  name: 'Certifcations',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Certificaciones',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'certifications',
      meta: {
        isComplete: true,
        nameLabel: 'Certificaciones',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; menu: boolean } }) => {
        return {
          nameModule: 'Certificaciones',
          idUser: route.query.iduser,
          menu: route.query.menu,
        };
      },
    },
  ],
};
