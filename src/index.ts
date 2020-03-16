// ref:
// - https://umijs.org/plugin/develop.html

import { IApi } from 'umi-types'

import router, { IOpts } from './router'

// Get Model Filepath Under Folder(model/models)

export default function(api: IApi, opts: IOpts = {}) {
  // Overwrite .umi/routes.js
  if (opts && opts.enable) {
    router(api, opts)
  }
}
