import type { RouteRecordRaw } from 'vue-router';

const publicRoutes : RouteRecordRaw[] = [
    {
        path: '',
        name: 'private',
        component: ()=> import('@/modules/auth/layouts/PrivateLayout.vue'),
        children:[
            {
                path: '',
                name: 'login',
                component: ()=> import('@/modules/auth/pages/LoginPage.vue')
            }
        ]
    }
];

export default publicRoutes;