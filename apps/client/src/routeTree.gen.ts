/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AdminImport } from './routes/admin'
import { Route as IndexImport } from './routes/index'
import { Route as PeopleIdImport } from './routes/people.$id'
import { Route as PeopleIdEditImport } from './routes/people_.$id.edit'

// Create/Update Routes

const AdminRoute = AdminImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PeopleIdRoute = PeopleIdImport.update({
  id: '/people/$id',
  path: '/people/$id',
  getParentRoute: () => rootRoute,
} as any)

const PeopleIdEditRoute = PeopleIdEditImport.update({
  id: '/people_/$id/edit',
  path: '/people/$id/edit',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/people/$id': {
      id: '/people/$id'
      path: '/people/$id'
      fullPath: '/people/$id'
      preLoaderRoute: typeof PeopleIdImport
      parentRoute: typeof rootRoute
    }
    '/people_/$id/edit': {
      id: '/people_/$id/edit'
      path: '/people/$id/edit'
      fullPath: '/people/$id/edit'
      preLoaderRoute: typeof PeopleIdEditImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/people/$id': typeof PeopleIdRoute
  '/people/$id/edit': typeof PeopleIdEditRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/people/$id': typeof PeopleIdRoute
  '/people/$id/edit': typeof PeopleIdEditRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/people/$id': typeof PeopleIdRoute
  '/people_/$id/edit': typeof PeopleIdEditRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/admin' | '/people/$id' | '/people/$id/edit'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/admin' | '/people/$id' | '/people/$id/edit'
  id: '__root__' | '/' | '/admin' | '/people/$id' | '/people_/$id/edit'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRoute: typeof AdminRoute
  PeopleIdRoute: typeof PeopleIdRoute
  PeopleIdEditRoute: typeof PeopleIdEditRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AdminRoute: AdminRoute,
  PeopleIdRoute: PeopleIdRoute,
  PeopleIdEditRoute: PeopleIdEditRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/admin",
        "/people/$id",
        "/people_/$id/edit"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/admin": {
      "filePath": "admin.tsx"
    },
    "/people/$id": {
      "filePath": "people.$id.tsx"
    },
    "/people_/$id/edit": {
      "filePath": "people_.$id.edit.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
