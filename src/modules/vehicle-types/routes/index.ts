import type { RouteRecordRaw } from 'vue-router';

const vehicleTypesRoutes: RouteRecordRaw[] = [
    {
        path: 'vehicle-types',
        name: 'vehicle-types-list',
        component: () => import('../pages/VehicleTypesPage.vue'),
    },
    {
        path: 'vehicle-types/create',
        name: 'vehicle-types-create',
        component: () => import('../pages/VehicleTypeFormPage.vue'),
    },
    {
        path: 'vehicle-types/:id/edit',
        name: 'vehicle-types-edit',
        component: () => import('../pages/VehicleTypeFormPage.vue'),
    }
];

export default vehicleTypesRoutes;
