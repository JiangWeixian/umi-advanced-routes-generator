import { IApi } from 'umi-types'

const getRouteConfig = require('umi-build-dev/lib/routes/getRouteConfig').default

export function getRouteManager(service: IApi) {
  const { paths } = service
  return {
    routes: null,
    fetchRoutes() {
      const routes = service.applyPlugins('modifyRoutes', {
        initialValue: getRouteConfig(paths, {}, (route: any) => {
          service.applyPlugins('onPatchRoute', {
            args: {
              route,
            },
          })
        }),
      })
      this.routes = routes
      service.routes = routes
    },
  }
}
