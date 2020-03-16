import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { IApi } from 'umi-types'
import Mustache from 'mustache'

const stripJSONQuote = require('umi-build-dev/lib/routes/stripJSONQuote').default
const importsToStr = require('umi-build-dev/lib/importsToStr').default
const _FilesGenerator = require('umi-build-dev/lib/FilesGenerator').default
const routesToJSON = require('umi-build-dev/lib/routes/routesToJSON').default

import { getRouteManager } from './getRouteManager'

const ENABLE_MODAL_FLAG = 'modalKey'
const ROUTER_TPL_PATH = join(__dirname, '../template/router.js.tpl')

type Routes = {
  path: string
  modalKey: string
  routes: Routes[]
}

export type IOpts = {
  enable?: boolean
  auth?: boolean
}

type Props = {
  routerTplPath: string
  service: IApi
  RoutesManager: unknown
} & IOpts

class FilesGenerator extends _FilesGenerator {
  routerTplPath: string
  routesContent: string
  auth: boolean
  constructor(props: Props) {
    super(props)
    this.routerTplPath = props.routerTplPath
    this.routesContent = ''
    this.auth = !!props.auth
  }

  // Create New router.js after Original router.js
  generate() {
    this.generateFiles()
  }

  // compare to origin generateFiles, just generateRouteJS
  generateFiles() {
    this.generateRouterJS()
  }

  generateRouterJS() {
    const { paths } = this.service
    const { absRouterJSPath } = paths
    this.RoutesManager.fetchRoutes()

    const routesContent = this.getRouterJSContent()
    // 避免文件写入导致不必要的 webpack 编译
    if (this.routesContent !== routesContent) {
      writeFileSync(absRouterJSPath, `${routesContent.trim()}\n`, 'utf-8')
      this.routesContent = routesContent
    }
  }

  // Rebuild is UnNeeded
  rebuild() {
    console.info('Dont rebuild')
  }

  getRouterJSContent() {
    const routerTpl = readFileSync(this.routerTplPath, 'utf-8')
    const routes = stripJSONQuote(
      this.getRoutesJSON({
        env: process.env.NODE_ENV,
      }),
    )
    const rendererWrappers = this.service
      .applyPlugins('addRendererWrapperWithComponent', {
        initialValue: [],
      })
      .map((source: unknown, index: number) => {
        return {
          source,
          specifier: `RendererWrapper${index}`,
        }
      })

    const modalRouterContent = this.getModalRouterContent()
    const routerContent = this.getRouterContent(rendererWrappers)
    return Mustache.render(routerTpl, {
      imports: importsToStr(
        this.service.applyPlugins('addRouterImport', {
          initialValue: rendererWrappers,
        }),
      ).join('\n'),
      pkg: `import pkg from "${this.service.paths.cwd}/package.json"`,
      globalVariables: !this.service.config.disableGlobalVariables,
      importsAhead: importsToStr(
        this.service.applyPlugins('addRouterImportAhead', {
          initialValue: [],
        }),
      ).join('\n'),
      authed: this.auth,
      routes,
      modalRouterContent,
      routerContent,
      RouterRootComponent: this.service.applyPlugins('modifyRouterRootComponent', {
        initialValue: 'DefaultRouter',
      }),
    })
  }

  // router component content
  getRouterContent(rendererWrappers: { specifier: string }[]) {
    const defaultRenderer = `
    <Router history={history}>
      <Route render={(p) => <ModalRouter { ...p } extraProps={props} />} />
    </Router>
    `.trim()
    return rendererWrappers.reduce((memo, wrapper) => {
      return `
        <${wrapper.specifier}>
          ${memo}
        </${wrapper.specifier}>
      `.trim()
    }, defaultRenderer)
  }

  // is modal Route
  isModalRoute(route: Routes): boolean {
    return !!(route.path && !!route[ENABLE_MODAL_FLAG])
  }

  // extract modal routes
  getModalRoutes(routes: Routes[]): Routes[] {
    return routes.reduce((memo: Routes[], route) => {
      return [
        ...memo,
        ...(this.isModalRoute(route) ? [route] : []),
        ...(route.routes ? this.getModalRoutes(route.routes) : []),
      ]
    }, [])
  }

  // convert modal routes(Routes[]) to string
  getModalRouterContent(): string {
    const modalRoutes = stripJSONQuote(
      routesToJSON(
        this.getModalRoutes(this.RoutesManager.routes),
        this.service,
        process.env.NODE_ENV,
      ),
    )
    return modalRoutes
  }
}

// async generate new route files
const waitFor = (sec: number) => {
  const now = Date.now()
  while (Date.now() < now + sec * 1000) {
    // do nothing
  }
}

// entry
export default function(api: IApi, opts: IOpts) {
  const RoutesManager = getRouteManager(api)
  const filesGenerator = new FilesGenerator({
    service: api,
    RoutesManager,
    routerTplPath: ROUTER_TPL_PATH,
    auth: opts.auth,
  })
  api.onGenerateFiles(() => {
    return new Promise(function(resolve) {
      resolve(true)
    }).then(() => {
      console.info('Building New .umi/router.js, Waiting 👓 for 1s')
      filesGenerator.generate()
      waitFor(1)
      console.info('Builded New .umi/router.js')
    })
  })
}
