import React, {useState, useEffect} from 'react'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { dmsSiteFactory, registerDataType, Selector, adminConfig, registerComponents } from "~/modules/dms/src/"
import ComponentRegistry from '~/component_registry'
import themes from '~/dms_themes'

import { withAuth, useAuth } from "~/modules/ams/src"
import Auth from '~/pages/Auth'

import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes from "~/pages/HazmitDataTypes"
import { authMenuConfig } from "~/layout/authMenuConfig"
import { useFalcor } from "~/modules/avl-falcor"
import LayoutWrapper from "~/layout/LayoutWrapper"

import AdditionalComponents from "./additional_components";
import {DamaMap} from "./pages/DataManager/"

registerComponents({...ComponentRegistry, ...AdditionalComponents, "Map: Dama": DamaMap})
registerDataType("selector", Selector)


Auth.forEach(f => {
  f.Component = f.element 
  delete f.element
})

function App() {
  // Load Site Routes
  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  useEffect(() => {
        (async function() {
            const dynamicRoutes = await dmsSiteFactory({
                dmsConfig: adminConfig({
                    app: 'mitigat-ny-prod',
                    type: 'prod',
                    // app: 'admin-new',
                    // type: 'pattern-admin',
                }),
                authWrapper: withAuth,
                themes,
                // API_HOST: 'http://localhost:4444'
            });
            setDynamicRoutes(dynamicRoutes);
        })()
    }, []);

    const PageNotFoundRoute = {
        path: "/*",
        Component: () => (<div className={'w-screen h-screen flex items-center bg-blue-50'}> ... </div>)
    }

    return (
      <RouterProvider 
        router={createBrowserRouter([
            // Site manager
            // Data Manager
            ...LayoutWrapper(DamaRoutes({
              baseUrl:'/cenrep',
              defaultPgEnv : "hazmit_dama",
              navSettings: authMenuConfig,
              dataTypes: hazmitDataTypes,
              useFalcor,
              useAuth
            })),
            // Auth
            ...LayoutWrapper(Auth),
            ...dynamicRoutes,
            
            PageNotFoundRoute 
        ])} 
      />
    )
}

export default App


