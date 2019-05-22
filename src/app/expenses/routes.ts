import { RouteConfig } from 'vue-router/types/router';

export const ExpensesRoutes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/expenses',
  },
  {
    path: '/expenses',
    component: () => import(/* webpackChunkName: "expenses" */ './Expenses/Expenses.vue').then((m: any) => m.default),
  },
];
