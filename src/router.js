import Vue from 'vue';
import VueRouter from 'vue-router';

const listVue = resolve => require(['./views/list'], resolve);

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/search/',
      name:'searchPage',
      component: listVue
    },
    {
      path: '/list/',
      name: 'listKeyCate',
      component: listVue
    },
    {
      path: '/category/:cate',
      name:'categoryKw',
      component: listVue
    }
  ]
})

/**
 * Before a route is resolved we check for
 * the token if the route is marked as
 * requireAuth.
 */
// router.beforeEach(beforeEach)

export default router
