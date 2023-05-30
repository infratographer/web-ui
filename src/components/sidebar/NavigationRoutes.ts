export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

const navigation = {
  root: {
    name: "/",
    displayName: "navigationRoutes.home",
  },

  routes: [
    {
      name: "dashboard",
      displayName: "Dashboard",
      meta: {
        icon: "vuestic-iconset-dashboard",
      },
    },
    {
      name: "tenants",
      displayName: "Tenants",
      meta: {
        icon: "fa4-sitemap",
      },
    },
    {
      name: "locations",
      displayName: "Locations",
      meta: {
        icon: "fa4-building",
      },
    },
  ] as INavigationRoute[],
}

export default navigation
