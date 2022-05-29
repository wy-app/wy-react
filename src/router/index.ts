import React from 'react'
export interface IRouteMeta {
  title: string
  icon?: string
}

export interface IRouteBase {
  path: string
  name: string
  component?: any
  redirect?: string
  meta: IRouteMeta
}

export interface IRoute extends IRouteBase {
  children?: IRoute[]
}

const routes: IRoute[] = [{
  path: '/',
  name: 'Home',
  component: React.lazy(() => import('../pages/index/index')),
  meta: {
    title: '首页'
  }
}, {
  path: '/search',
  name: 'SearchPage',
  component: React.lazy(() => import('../pages/search/index')),
  meta: {
    title: '搜索'
  }
}, {
  path: '/detail',
  name: 'Detail',
  component: React.lazy(() => import('../pages/search/Detail')),
  meta: {
    title: '新闻详情'
  }
}]

export default routes
