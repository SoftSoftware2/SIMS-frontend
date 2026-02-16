import type { RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/routes";
import companiesRoutes from "@/modules/companies/routes";
import vehicleTypesRoutes from "@/modules/vehicle-types/routes";
import vehiclesRoutes from "@/modules/vehicles/routes";

const privateRoutes : RouteRecordRaw[] = [
    {
        path: '/app',
        name: 'public',
        component: ()=> import('@/modules/common/layouts/DefaultLayout.vue'),
        children:[
            ... homeRoutes,
            ... companiesRoutes,
            ... vehicleTypesRoutes,
            ... vehiclesRoutes,
        ]
    }
];

export default privateRoutes;
