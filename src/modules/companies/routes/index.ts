import type { RouteRecordRaw } from 'vue-router';

const companiesRoutes: RouteRecordRaw[] = [
    {
        path: 'companies',
        name: 'companies-list',
        component: () => import('../pages/CompaniesPage.vue'),
    },
    {
        path: 'companies/new',
        name: 'companies-create',
        component: () => import('../pages/CompanyFormPage.vue'),
    },
    {
        path: 'companies/:id/edit',
        name: 'companies-edit',
        component: () => import('../pages/CompanyFormPage.vue'),
    }
];

export default companiesRoutes;
