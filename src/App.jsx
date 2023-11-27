import React, {useMemo} from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

// import { Messages } from '~/modules/avl-components/src'
import { Messages } from '~/modules/ams/src'

import Layout from '~/layout/avail-layout'
import LayoutWrapper from '~/layout/LayoutWrapper'

import { getSubdomain }  from '~/utils'

import DefaultRoutes from '~/routes'
import www from '~/sites/www'

const Sites = {
  www
}

function App (props) {
  const SUBDOMAIN = getSubdomain(window.location.host)
  
  const site = useMemo(() => {
      return Sites?.[SUBDOMAIN] || Sites['www']
  },[SUBDOMAIN])

  const WrappedRoutes =  useMemo(() => {
    const Routes = [...site.Routes, ...DefaultRoutes]
    return LayoutWrapper(Routes, Layout)
  }, [site])
  
  
  return (
    <>
      <RouterProvider router={createBrowserRouter(WrappedRoutes)} />
      <Messages />
    </>
  )

  
}

export default App;
