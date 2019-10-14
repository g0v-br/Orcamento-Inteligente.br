import Vue from 'vue'
import Router from 'vue-router'
import { store, dref, fetcher  } from './services/rdfService';

// console.table(dref("/partition/overview"));

Vue.use(Router)


export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/credits',
            name: 'credits',
            component: () => import('./views/Credits.vue'),
            beforeEnter: async (to, from, next) => {
                await fetcher.load(dref(to.path))
                next();
            }
        },
        {
            path: '/terms',
            name: 'terms',
            component: () => import('./views/TermsAndConditions.vue'),
            beforeEnter: async (to, from, next) => {
                await fetcher.load(dref(to.path))
                next();
            }
        },
        {
            path: '/table',
            name: 'table',
            component: () => import('./views/Table.vue'),
            beforeEnter: async (to, from, next) => {
                await fetcher.load(dref(to.path))
                next();
            }
        },
        {
            path: '/account/:accountId',
            name: 'account',
            component: () => import('./views/Account.vue'),
            props: true,
            beforeEnter: async (to, from, next) => {
                await fetcher.load(dref(to.path))
                next();
            }
        },
        {
            path: '/partition/:partitionId',
            name: 'accounts-partition',
            component: () => import('./views/Overview.vue'),
            props: true,
            beforeEnter: async (to, from, next) => {
                await fetcher.load(dref(to.path))
                next();
            }
        },
        {
            path: '/',
            name: 'overview',
            redirect: { name: 'accounts-partition', params: { partitionId: 'overview' } }
        },
        {
            path: '*',
            redirect: { name: 'overview' }
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('./views/errors/500.vue')
        }
    ]
})
