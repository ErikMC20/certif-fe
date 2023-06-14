export default {
  name: 'Accounts',
  component: () =>import(/* webpackChunkName: "accounts" */ '../../../layouts/HomeLayout.vue'),
    meta: {
      nameLabel: 'Cuentas',
      requireAuth: false,
      isComplete: true,
    },
    children: [
      {
        path: '',
        name: 'accounts',
        meta: {
          isComplete: true,
          nameLabel: 'Cuentas',
        },
        component: () =>import(/* webpackChunkName: "account-list" */ '../pages/viewList/ViewList.vue'),
        props: (route: { query: { iduser: string; menu: boolean } }) => {
          return {
            nameModule: 'Cuentas',
            idUser: route.query.iduser,
            menu: route.query.menu,
          };
        },
      },
      {
        path: ':iduser',
        name: 'viewAccount',
        component: () =>import(/* webpackChunkName: "account-list-user" */ '../pages/viewList/ViewList.vue'),
        props: (route: { params: { iduser: string } }) => {
          return {
            nameModule: 'Cuentas',
            iduser: route.params.iduser,
          };
        },
      },
    ],
};
