import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes from "~/pages/HazmitDataTypes"

import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src"

import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"

import siteConfig from '~/modules/dms/src/patterns/page/siteConfig'
import ComponentRegistry from '~/component_registry'
import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/components/selector"
import {API_HOST} from "../../config.js";
// import BuildingFootprintsDownload from "./buildings_download"

registerComponents(ComponentRegistry)
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
  //BuildingFootprintsDownload,
  // ...DamaRoutes({
  //   baseUrl:'/cenrep',
  //   defaultPgEnv : "kari",
  //   navSettings: authMenuConfig,
  //   dataTypes: hazmitDataTypes,
  //   useFalcor,
  //   useAuth
  // }),
  {
    ...dmsPageFactory(
      siteConfig({ 
        app: "dms-site",
        type: "docs-countytemplate",
        logo: <Logo />, 
        rightMenu: <AuthMenu />,
        useFalcor,
        baseUrl: "",
        API_HOST,
        checkAuth
      }),
      withAuth
    ),
    authLevel: 5,
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