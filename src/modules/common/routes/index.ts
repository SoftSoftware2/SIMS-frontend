import type { RouteRecordRaw } from "vue-router";
import homeRoutes from "@/modules/home/routes";

const privateRoutes : RouteRecordRaw[] = [
    {
        path: '/app',
        name: 'public',
        component: ()=> import('@/modules/common/layouts/DefaultLayout.vue'),
        children:[
            ... homeRoutes,
        ]
    }
];

export default privateRoutes;