import React, {useState, useEffect} from 'react'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { DmsSite, dmsSiteFactory, registerDataType, Selector, adminConfig, registerComponents } from "~/modules/dms/src/"
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
import { DamaMap, Map } from "./pages/DataManager/"

import siteData from './siteData.json'

registerComponents({
  ...ComponentRegistry, 
  ...AdditionalComponents,
  "Map: Dama Map": DamaMap,
  "Map": Map
})

registerDataType("selector", Selector)


// Auth.forEach(f => {
//   f.Component = f.element 
//   delete f.element
// })

function App() {
    return (
      <DmsSite
        dmsConfig = {
          adminConfig({
            app: 'mitigat-ny-prod',
            type: 'prod'
          })
        }
        defaultData={siteData}
        authWrapper={withAuth}
        themes={themes}
        // API_HOST='http://localhost:4444'
        
        routes={[
          //cenrep
          ...LayoutWrapper(DamaRoutes({
              baseUrl:'/cenrep',
              defaultPgEnv : "hazmit_dama",
              navSettings: authMenuConfig,
              dataTypes: hazmitDataTypes,
              useFalcor,
              useAuth
            })),
          // Auth
          ...LayoutWrapper(Auth)
        ]} 
      />
    )
}

export default App


