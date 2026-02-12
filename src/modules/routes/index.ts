import { createRouter, createWebHistory } from 'vue-router'
import publicRoutes from '../auth/routes'
import { isAuthGuard } from '../auth/guards/auth.guard'

const routes =[
    {
        path: '',
        name: '',
        beforeEnter: isAuthGuard,
        children: [

            ... publicRoutes,

        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/modules/common/pages/NotFoundPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router