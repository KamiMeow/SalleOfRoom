import Vue from 'vue';
import VueRouter from 'vue-router';
import initListners from './initListners';
import listners from './listners';

import usersChildren from './routes/users';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login'),
  },

  {
    path: '/users',
    meta: {
      role: 'admin',
    },
    children: usersChildren,
  },

  {
    path: '/*',
    redirect: '/login',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default initListners(router, listners);
