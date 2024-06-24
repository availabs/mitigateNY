import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes from "~/pages/HazmitDataTypes"

import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"
import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'
import { withAuth } from "~/modules/ams/src"

import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"

import ComponentRegistry from '~/component_registry'

import BuildingFootprintsDownload from "./buildings_download"
import { DamaMap } from '~/pages/DataManager'

registerComponents({
  ...ComponentRegistry,
  "Map: Dama Map": DamaMap
})

registerDataType("selector", Selector)

const authMenuConfig = {
  sideNav: {
    size: 'none',
    color: 'white'
    
  },
  topNav: {
    position: 'fixed',
    size: 'compact'
  },
}

const Routes = [
  BuildingFootprintsDownload,
  ...DamaRoutes({
    baseUrl:'/cenrep',
    defaultPgEnv : "hazmit_dama",
    navSettings: authMenuConfig,
    dataTypes: hazmitDataTypes,
    useFalcor,
    useAuth
  }),
  {
    ...dmsPageFactory(
      siteConfig({ 
        app: "dms-site",
        type: "docs-footprints",
        logo: <Logo />, 
        rightMenu: <AuthMenu />,
        useFalcor,
        baseUrl: "",
        checkAuth,
        authLevel: 5,
        pgEnv: "hazmit_dama"
      }),
      withAuth
    ),
    name: "CMS",
    sideNav: {
      size: "none"
    },
    topNav: {
      size: "none"
    }
  }
]

const site = {
	Routes
}

export default site