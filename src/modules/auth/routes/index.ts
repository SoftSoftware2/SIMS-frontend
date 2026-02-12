const publicRoutes = [
    {
        path: '/login',
        name: 'private',
        component: ()=> import('@/modules/auth/layouts/PrivateLayout.vue'),
        children:[
            {
                path: '',
                name: 'login',
                component: ()=> import('@/modules/auth/pages/LoginFormPage.vue')
            }
        ]
    }
];

export default publicRoutes;