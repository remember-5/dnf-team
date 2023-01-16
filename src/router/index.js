import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/index.vue";
import JunTuan from "../views/juntuan/index.vue";
import BaKaEr from "../views/bakaer/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/juntuan",
      name: "juntuan",
      component: JunTuan,
    },
    {
      path: "/bakaer",
      name: "bakaer",
      component: BaKaEr,
    },
  ],
});

export default router;
