import { createRouter, createWebHistory } from 'vue-router'

const routes =[
    {
        path: '/',
        component: ()=>import('@/modules/common/layouts/DefaultLayout.vue'),
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: ()=>import('@/modules/home/pages/HomePage.vue'),
            },
            {
                path: 'companies',
                name: 'companies',
                component: ()=>import('@/modules/companies/pages/CompaniesPage.vue'),
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router