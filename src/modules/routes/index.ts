import { createRouter, createWebHistory } from 'vue-router'

const routes =[
    {
        path: '/',
        component: ()=>import('@/modules/common/layouts/DefaultLayout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: ()=>import('@/modules/pages/DashBoard.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router