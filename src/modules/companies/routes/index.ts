import type { RouteRecordRaw } from 'vue-router';

const companiesRoutes: RouteRecordRaw[] = [
    {
        path: '/app/companies',
        name: 'companies-list',
        component: () => import('../pages/CompaniesPage.vue'),
    }
];

export default companiesRoutes;
