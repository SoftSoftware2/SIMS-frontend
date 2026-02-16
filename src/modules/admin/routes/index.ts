import type { RouteRecordRaw } from 'vue-router';

const adminRoutes: RouteRecordRaw[] = [
    {
        path: 'admins',
        name: 'admins',
        component: ()=> import('@/modules/admin/pages/AdminPage.vue'),
    },
    {
        path: 'admins/create',
        name: 'admin-form',
        component: ()=> import('@/modules/admin/pages/AdminFormPage.vue'),
    },
    {
        path: 'admins/:id/edit',
        name: 'admin-edit',
        component: ()=> import('@/modules/admin/pages/AdminFormPage.vue'),
    }
];

export default adminRoutes;