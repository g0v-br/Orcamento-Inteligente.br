import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
        path: '/credits',
        name: 'credits',
        component: () => import('./views/Credits.vue')
    },
    {
        path: '/table',
        name: 'table',
        component: () => import('./views/Table.vue')
    },
    {
        path: '/terms',
        name: 'terms',
        component: () => import('./views/TermsAndConditions.vue')
    },
    {
        path: '/account/:accountId',
        name: 'account',
        component: () => import('./views/Account.vue'),
        props: true
    },
    {
        path: '/partition/:partitionId',
        name: 'accounts-partition',
        component: () => import('./views/BigPicture.vue'),
        props: true
    },
    {
        path: '/',
        name: 'bigPicture',
        component: () => import('./views/BigPicture.vue')
    },
    {
        path: '*',
        redirect: { name: '404' },
        component: () => import('./views/404.vue')
    }
]
})
