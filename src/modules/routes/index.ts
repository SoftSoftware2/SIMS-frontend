import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router';
import { isAuthGuard } from '../auth/guards/auth.guard'
import privateRoutes from '../common/routes';
import publicRoutes from '../auth/routes';
const routes : RouteRecordRaw[] =[
    {
        path: '',
        name: '',
        beforeEnter: isAuthGuard,
        children: [

            ...publicRoutes,
            
            ...privateRoutes,
            {
                path: '/:pathMatch(.*)*',
                name: 'NotFound',
                component: () => import('@/modules/common/pages/NotFoundPage.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router