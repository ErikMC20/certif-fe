export default {
  path: '/survey',
  component: () => import('/src/layouts/HomeLayout.vue'),
  meta: {
    nameLabel: 'Encuestas',
    iconModule: 'article',
    requireAuth: false,
    isComplete: true,
  },
  children: [
    {
      path: '',
      name: 'surveys',
      component: () => import('../pages/List/ViewList.vue'),
      meta: {},
    },
    {
      path: 'add',
      name: 'add-survey',
      component: () => import('../pages/Add/ViewAdd.vue'),
    },
    {
      path: 'edit/:id',
      name: 'edit-survey',
      component: () => import('../pages/Add/ViewAdd.vue'),
    },
  ],
};
