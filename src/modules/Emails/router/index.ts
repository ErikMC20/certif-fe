export default {
  name: 'Emails',
  meta: {
    isComplete: true,
    nameLabel: 'Emails',
  },
  component: () => import('../../../layouts/HomeLayout.vue'),
  children: [
    {
      path: '',
      name: 'emails',
      component: () => import('../pages/EmailsTemplate.vue'),
    },
    {
      path: 'my-playground',
      name: 'sergio-playground',
      component: () => import('../pages/EmailsPlayground.vue'),
    },
  ],
};
