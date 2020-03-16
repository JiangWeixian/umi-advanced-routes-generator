# umi-plugin-pro-routes

[![NPM version](https://img.shields.io/npm/v/umi-plugin-pro-routes.svg?style=flat)](https://npmjs.org/package/umi-plugin-pro-routes)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-pro-routes.svg?style=flat)](https://npmjs.org/package/umi-plugin-pro-routes)

- [umi-plugin-pro-routes](#umi-plugin-pro-routes)
  - [How it works?](#how-it-works)
  - [ScreenShots](#screenshots)
  - [Usage](#usage)
  - [Options](#options)
  - [LICENSE](#license)


**WARNING:** *different umi version has different router template version, please use **umi@2.9.6***

## How it works?

Modal page depends on [react-router](https://reacttraining.com/react-router/web/example/modal-gallery), [umi-plugin-pro-routes]() will generate a new `router.js` to overwrite original one.

## ScreenShots

![pro-routes](/screenshots/pro-routes.gif)

## Usage
> see [example](/example/pages/index.tsx) for more details
 
Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-pro-routes', { enable: true }],
  ],
}
```

Configure in any page,

```yaml
/**
* modalKey: {string} // like PageOne
*/
```

Dipatch with router

```tsx
import { router } from 'umi'

<Button
  onClick={() => {
    router.push({
      pathname: '/modal-page/pageone',
      search: 'modalKey=PageOne',
    })
  }}
>
  弹窗
</Button>
```

**Supper simple**

## Options

```tsx
{
  enable?: boolean
}
```

## LICENSE

MIT
