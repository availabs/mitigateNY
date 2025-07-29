import React from 'react'

import {
  DmsSite,
  registerDataType,
  Selector,
  adminConfig,
  registerComponents
} from "~/modules/dms/src/"
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
import {PROJECT_NAME, API_HOST, AUTH_HOST} from "./config.js";
import siteData from './siteData.json'

registerComponents({
  ...ComponentRegistry, 
  ...AdditionalComponents,
  "Map: Dama Map": DamaMap,
  "Map": Map
})

registerDataType("selector", Selector)

const WrappedAuth = LayoutWrapper(Auth)
//console.log('mny auth', Auth, WrappedAuth)
const defaultPgEnv = 'hazmit_dama';
const adminBaseUrl = '/list'
const authBaseUrl = '/dms_auth'
const damaBaseUrl = '/cenrep'

const testEnv = false;
let app = 'mitigat-ny-prod';
let type = 'prod'

if(testEnv){
    app = 'test-auth-shaun-existing-user-1'
    type = 'test1'
}

function App() {
    return (
      <DmsSite
        dmsConfig = {
          adminConfig[0]({
              app, type, baseUrl: adminBaseUrl, authPath: authBaseUrl,
             API_HOST, AUTH_HOST
          })
        }
        PROJECT_NAME={PROJECT_NAME}
        adminPath={adminBaseUrl}
        pgEnvs={[defaultPgEnv]}
        // defaultData={siteData}
        // authWrapper={withAuth}
        themes={themes}
        damaBaseUrl={damaBaseUrl}
        API_HOST={API_HOST}
        AUTH_HOST={AUTH_HOST}

        routes={[
          //cenrep
          ...LayoutWrapper(DamaRoutes({
              baseUrl:damaBaseUrl,
              defaultPgEnv,
              navSettings: authMenuConfig,
              dataTypes: hazmitDataTypes,
              useFalcor,
              useAuth
            })),
          // Auth
          ...WrappedAuth
        ]} 
      />
    )
}

export default App


