import type { RouteRecordRaw } from 'vue-router';

const homeRoutes: RouteRecordRaw[] = [
    {
        path: '',
        name: 'home',
        component: ()=> import('@/modules/home/pages/HomePage.vue'),
    }
];

export default homeRoutes;