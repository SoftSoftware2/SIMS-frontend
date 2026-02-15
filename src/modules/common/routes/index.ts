import type { RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/routes";
import companiesRoutes from "@/modules/companies/routes";

const privateRoutes : RouteRecordRaw[] = [
    {
        path: '/app',
        name: 'public',
        component: ()=> import('@/modules/common/layouts/DefaultLayout.vue'),
        children:[
            ... homeRoutes,
            ... companiesRoutes,
        ]
    }
];

export default privateRoutes;