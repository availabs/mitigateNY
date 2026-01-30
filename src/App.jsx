import React from 'react'

import {
  DmsSite,
  adminConfig,
  registerComponents,
  useAuth
} from "./modules/dms/packages/dms/src"


import themes from './dms_themes'


import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes, { mapPlugins } from "~/pages/HazmitDataTypes"
import { authMenuConfig } from "~/layout/authMenuConfig"
import { useFalcor } from "~/modules/avl-falcor"
import LayoutWrapper from "~/layout/LayoutWrapper"

import siteData from './siteData.json'

import { DamaMap, Map } from "./pages/DataManager/"


import {PROJECT_NAME, API_HOST, AUTH_HOST, DAMA_HOST} from "./config.js";

//import siteData from './siteData.json'

registerComponents({
  // ...ComponentRegistry,
  // ...AdditionalComponents,
  "Map: Dama Map": DamaMap,
  "Map": Map
})

// const WrappedAuth = LayoutWrapper(Auth)

const defaultPgEnv = 'hazmit_dama';
const adminBaseUrl = '/list'
const authBaseUrl = '/auth'
const damaBaseUrl = '/cenrep'

const testEnv = false;
let app = 'mitigat-ny-prod';
let type = 'prod'

if(testEnv){
    app = 'test-auth-shaun-existing-user-1'
    type = 'test1'
}

function App() {
    //console.log('app js', themes)
    return (
      <DmsSite
        dmsConfig = {
          adminConfig[0]({
              app, type,
              themes,
              baseUrl: adminBaseUrl,
              authPath: authBaseUrl,
          })
        }
        PROJECT_NAME={PROJECT_NAME}
        adminPath={adminBaseUrl}
        authPath={authBaseUrl}
        damaBaseUrl={damaBaseUrl}
        pgEnvs={[defaultPgEnv]}
        defaultData={siteData}
        themes={themes}

        API_HOST={API_HOST}
        AUTH_HOST={AUTH_HOST}
        DAMA_HOST={DAMA_HOST}
        damaDataTypes={hazmitDataTypes}
        routes={[
          //cenrep
          ...LayoutWrapper(
            DamaRoutes({
              mapPlugins: mapPlugins,
              baseUrl:damaBaseUrl,
              defaultPgEnv,
              navSettings: authMenuConfig,
              dataTypes: hazmitDataTypes,
              useFalcor,
              useAuth
            })
          ),
          // Auth
          // ...WrappedAuth
        ]}
      />
    )
}

export default App
