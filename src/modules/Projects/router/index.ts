export default {
  path: '/projects',
  component: () => import('src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Proyectos',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'projects',
      meta: {
        isComplete: true,
        nameLabel: 'Proyectos',
      },
      component: () => import('../views/ViewList.vue'),
      props: (route: { query: { iduser: string; moduleid: string } }) => {
        return {
          idUser: route.query.iduser,
          moduleId: route.query.moduleid,
        };
      },
    },
  ],
};
