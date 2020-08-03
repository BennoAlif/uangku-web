import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Layout from "../views/Layout.vue";
import Kategori from "../views/Kategori.vue";
import Beranda from "../views/Beranda.vue";
import Laporan from "../views/Laporan.vue";
import { auth } from "../firebase/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Layout",
    component: Layout,
    redirect: "/beranda",
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "beranda",
        name: "Beranda",
        component: Beranda,
      },
      {
        path: "laporan",
        name: "laporan",
        component: Laporan,
      },
      {
        path: "kategori",
        name: "Kategori",
        component: Kategori,
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
