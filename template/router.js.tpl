{{{ importsAhead }}}
import React, { useEffect, useContext } from 'react'
import { Router as DefaultRouter, Route, Switch, Redirect } from 'react-router-dom'
import dynamic from 'umi/dynamic'
import renderRoutes from 'umi/lib/renderRoutes'
import history from '@tmp/history';
{{{ imports }}}
{{{ pkg }}}

const Router = {{{ RouterRootComponent }}};

const routes = {{{ routes }}};
{{#globalVariables}}
window.g_routes = routes;
{{/globalVariables}}
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

// Nested Router

const renderChildRoutes = (route, props = {}, extraProps = {}) => {
  const childRoutes = renderRoutes(
    route.routes,
    {},
    {
      location: props.location,
    },
  );
  if (route.component) {
    const newProps = window.g_plugins.apply('modifyRouteProps', {
      initialValue: {
        ...props,
        ...extraProps,
      },
      args: { route },
    });
    return (
      <route.component {...newProps} route={route}>
        {childRoutes}
      </route.component>
    );
  } else {
    return childRoutes;
  }
}

const MODAL_ROUTER_KEY = `${pkg.name}-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}-modal-router-pathname`
const MODAL_ROUTER_FLAG = `${pkg.name}-${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}-modal-router-refresh`

window.onbeforeunload = () => {
  localStorage.setItem(MODAL_ROUTER_FLAG, true)
}

/**
* for first open, the origin location stack [this.props.pathname] will be ['/', this.props.pathname]
* @param location Location
*/
const initPreviouseLocation = (location) => {
  if (!location) {
    return location
  }
  const refreshFlag = JSON.parse(localStorage.getItem(MODAL_ROUTER_FLAG))
  const pathname = refreshFlag ? localStorage.getItem(MODAL_ROUTER_KEY) || '/' : '/'
  localStorage.setItem(MODAL_ROUTER_FLAG, false)
  window.history.replaceState(null, null, `#${pathname}`)
  window.history.pushState(null, null, `#${location.pathname}${location.search}`)
  return {
    ...location,
    pathname,
  }
}

const modalRoutes = {{{ modalRouterContent }}}

const RouterSwitch = (props) => {
  const filteredRoutes = routes
  const filteredModalRoutes = modalRoutes
  useEffect(() => {
    if (!props.isInModalRoutes) {
      localStorage.setItem(MODAL_ROUTER_KEY, props.location.pathname || '/')
    }
  })
  const finalModalRoutes = filteredModalRoutes
    ? filteredModalRoutes
        .map(route => {
          return props.isModal(route.modalKey)
          ? (
            <Route
              { ...route }
              component={undefined}
              render={(props) => renderChildRoutes(route, props, {})}
            />
          ) : null
        })
        .filter(route => !!route)
    : null
  return (
    <>
      { renderRoutes(filteredRoutes, props.extraProps, props.switchProps) }
      {
        finalModalRoutes
      }
    </>
  )
}

// Modal Router
class ModalRouter extends React.Component {
  previousLocation = initPreviouseLocation(this.props.location)
  componentWillUpdate(nextProps) {
    const { location } = this.props

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.query || !location.query.modalKey)
    ) {
      this.previousLocation = this.props.location
    }
  }

  isModal = (modalKey) => {
    const { location } = this.props
    return !!(
      location.query &&
      location.query.modalKey === modalKey &&
      this.previousLocation !== location
    ) // not inital render
  }

  isInModalRoutes = () => {
    return modalRoutes.some((modal) => this.isModal(modal.modalKey))
  }

  render() {
    const { location } = this.props
    const isInModalRoutes = this.isInModalRoutes()
    const switchProps = {
      location: isInModalRoutes ? this.previousLocation : location
    }
    return <RouterSwitch { ...this.props } extraProps={this.props.extraProps} switchProps={switchProps} isInModalRoutes={isInModalRoutes} isModal={this.isModal} />
  }
}

export default class RouterWrapper extends React.Component {
  unListen = () => {};

  constructor(props) {
    super(props);
    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    routeChangeHandler(history.location);
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      {{{ routerContent }}}
    );
  }
}