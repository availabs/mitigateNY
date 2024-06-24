
import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"
import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { useFalcor } from "~/modules/avl-falcor"
import { menuItems } from "../admin/index"

import ComponentRegistry from '~/component_registry'
import Additional_components from "~/additional_components/index.js";

registerComponents({...ComponentRegistry, ...Additional_components})
registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(
    siteConfig({ 
      app: "dms-site",
      type: "docs-page",
      useFalcor,
      logo: <Logo />, 
      rightMenu: <AuthMenu />,
      baseUrl: "",
      checkAuth
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