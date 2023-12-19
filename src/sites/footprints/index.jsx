import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import DamaRoutes from "~/pages/DataManager"

import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"

import siteConfig from '~/modules/dms/src/patterns/page/siteConfig'
import ComponentRegistry from '~/component_registry'
import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/selector"

registerComponents(ComponentRegistry)
registerDataType("selector", Selector)


const Routes = [
  // -- Admin Routes -- //
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
        baseUrl: "",
        checkAuth
      }), 
      "/", 
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