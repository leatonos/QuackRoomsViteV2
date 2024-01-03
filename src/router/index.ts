import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/room/:id', // Dynamic route parameter ":id"
    component: () => import('../views/Room.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
