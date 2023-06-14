import { RouteRecordRaw } from 'vue-router';

import certificationsRouter from 'src/modules/Certifications/router';
import companiesRouter from 'src/modules/Companies/router';
import productTypesRouter from 'src/modules/ProductTypes/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/certifications',
  },
  {
    path: '/certifications',
    ...certificationsRouter,
  },
  {
    path: '/companies',
    ...companiesRouter,
  },
  {
    path: '/product-types',
    ...productTypesRouter,
  },
  {
    path: '/login',
    component: () => import('../pages/LoginView.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
];

export default routes;
