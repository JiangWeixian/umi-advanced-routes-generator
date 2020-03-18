# umi-plugin-pro-routes

[![NPM version](https://img.shields.io/npm/v/umi-plugin-pro-routes.svg?style=flat)](https://npmjs.org/package/umi-plugin-pro-routes)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-pro-routes.svg?style=flat)](https://npmjs.org/package/umi-plugin-pro-routes)

- [umi-plugin-pro-routes](#umi-plugin-pro-routes)
  - [How it works?](#how-it-works)
  - [ScreenShots](#screenshots)
  - [Usage](#usage)
  - [Options](#options)
  - [LICENSE](#license)


**WARNING:** *不同版本的umi有不同路由生成模板, 请使用**umi@2.9.6***

[英文](/README_EN.md) | [中文](/README.md)

## How it works?

Modal page根据[react-router](https://reacttraining.com/react-router/web/example/modal-gallery)新特性, [umi-plugin-pro-routes]() 会异步的生成新的新的`router.js`, 然后覆盖原先的.

## ScreenShots

![pro-routes](/screenshots/pro-routes.gif)

## Usage
> 查看[example](/example/pages/index.tsx)

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
