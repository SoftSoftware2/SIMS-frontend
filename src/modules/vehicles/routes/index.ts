import type { RouteRecordRaw } from 'vue-router';

const vehiclesRoutes: RouteRecordRaw[] = [
    {
        path: 'vehicles',
        name: 'vehicles-list',
        component: () => import('../pages/VehiclesPage.vue'),
    },
    {
        path: 'vehicles/create',
        name: 'vehicles-create',
        component: () => import('../pages/VehicleFormPage.vue'),
    },
    {
        path: 'vehicles/:id/edit',
        name: 'vehicles-edit',
        component: () => import('../pages/VehicleFormPage.vue'),
    }
];

export default vehiclesRoutes;
