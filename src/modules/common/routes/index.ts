import type { RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/routes";
import companiesRoutes from "@/modules/companies/routes";
import adminRoutes from "@/modules/admin/routes";
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
            ... adminRoutes,
            ... vehicleTypesRoutes,
            ... vehiclesRoutes,
        ]
    }
];

export default privateRoutes;
