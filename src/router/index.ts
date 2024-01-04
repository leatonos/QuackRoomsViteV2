import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name:'Home',
    component: ()=>import('../views/Home.vue'),
  },
  {
    path: '/room/:id', // Dynamic route parameter ":id"
    name: "Room",
    component: ()=>import('../views/Room.vue'),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
