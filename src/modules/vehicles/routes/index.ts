import type { RouteRecordRaw } from 'vue-router';

const vehiclesRoutes: RouteRecordRaw[] = [
    {
        path: 'vehicles',
        name: 'vehicles-list',
        component: () => import('../pages/VehiclesPage.vue'),
    }
];

export default vehiclesRoutes;
