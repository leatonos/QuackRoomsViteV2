import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Room from '../views/Room.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name:'Home',
    component: Home,
  },
  {
    path: '/room/:id', // Dynamic route parameter ":id"
    name: "Room",
    component: Room,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
