import type { RouteRecordRaw } from 'vue-router';

const vehicleTypesRoutes: RouteRecordRaw[] = [
    {
        path: 'vehicle-types',
        name: 'vehicle-types-list',
        component: () => import('../pages/VehicleTypesPage.vue'),
    }
];

export default vehicleTypesRoutes;
