import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import { useGlobalStore } from "@/stores/global-store"

import AppLayout from "../layouts/AppLayout.vue"
import LoginPage from "../components/LoginPage.vue"
import LogoutPage from "../components/LogoutPage.vue"
import ErrorsToken from "../components/ErrorsToken.vue"
import ProfileDetails from "../components/ProfileDetails.vue"

import DashboardView from "../components/DashboardView.vue"
import TenantsList from "../components/TenantsList.vue"
import TenantDetails from "../components/TenantDetails.vue"
import LocationsList from "../components/LocationsList.vue"
import LocationDetails from "../components/LocationDetails.vue"
import AnnotationNamespaceDetails from "../components/AnnotationNamespaceDetails.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/:catchAll(.*)",
    redirect: { name: "dashboard" },
  },
  {
    name: "login",
    path: "/login",
    component: LoginPage,
  },
  {
    name: "logout",
    path: "/logout",
    component: LogoutPage,
  },
  {
    name: "home",
    path: "/",
    component: AppLayout,
    redirect: { name: "dashboard" },
    children: [
      {
        name: "dashboard",
        path: "dashboard",
        component: DashboardView,
      },
      {
        name: "annotation_ns_details",
        path: "annotation-namespace/:id",
        component: AnnotationNamespaceDetails,
        props: true,
      },
      {
        name: "tenants",
        path: "tenants",
        component: TenantsList,
      },
      {
        name: "tenant_details",
        path: "tenants/:id",
        component: TenantDetails,
        props: true,
      },
      {
        name: "locations",
        path: "locations",
        component: LocationsList,
      },
      {
        name: "location_details",
        path: "locations/:id",
        component: LocationDetails,
        props: true,
      },
      {
        name: "profile",
        path: "profile",
        component: ProfileDetails,
      },
      {
        name: "errors_token",
        path: "errors/token",
        component: ErrorsToken,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  if (!useGlobalStore().isAuthenticated && to.name !== "login") {
    console.debug("router.beforeEach: not authenticated, redirecting to login")
    return { name: "login" }
  }
})

export default router
