import { createRouter, createWebHashHistory } from "vue-router";

const lazyload = (componentPath) => {
  return () =>
    import(/* webpackChunkName: "[request]" */ `@/views/${componentPath}.vue`);
};

const routes = [
  {
    path: "/",
    name: "home",
    component: lazyload("HomePage"),
  },
  {
    path: "/timano",
    name: "Timano",
    component: lazyload("TimanoPage"),
  },
  {
    path: "/baku",
    name: "baku",
    component: lazyload("BakuPage"),
  },
  {
    path: "/sibir",
    name: "sibir",
    component: lazyload("SibirPage"),
  },
  {
    path: "/checkbox",
    name: "checkbox",
    component: lazyload("CheckBox"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
