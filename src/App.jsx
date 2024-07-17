import React, {useEffect, useMemo, useState} from 'react';
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
import buildings from '~/sites/buildings'
import {adminConfig, dmsSiteFactory} from "./modules/dms/src/index.js";
//import countytemplate from '~/sites/countytemplate'

const Sites = {
  www,
  buildings,
  //countytemplate
}

function App (props) {
  const SUBDOMAIN = getSubdomain(window.location.host);
  const [dynamicRoutes, setDynamicRoutes] = useState([]);

  const adminPath = '/forms';
  useEffect(() => {
    (async function() {
      const dynamicRoutes = await dmsSiteFactory({
        dmsConfig: adminConfig({
          app: 'admin-new',
          type: 'pattern-admin',
          baseUrl: ''
        }),
        adminPath,
        // API_HOST: 'http://localhost:4444'
      });
      console.log('routes', dynamicRoutes)
      setDynamicRoutes(dynamicRoutes);
    })()

  }, []);
  
  const site = useMemo(() => {
      return Sites?.[SUBDOMAIN] || Sites['www']
  },[SUBDOMAIN])

 
  const WrappedRoutes =  useMemo(() => {
    const Routes = [...site.Routes, ...DefaultRoutes]
    return LayoutWrapper(Routes, Layout)
  }, [site])

  return (
    <>
      <RouterProvider router={createBrowserRouter([...WrappedRoutes, ...dynamicRoutes])} />
      <Messages />
    </>
  )

  
}

export default App;
