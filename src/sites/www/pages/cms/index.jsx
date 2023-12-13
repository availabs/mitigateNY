
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"


import siteConfig from '~/modules/dms/src/patterns/page/siteConfig'
//import ComponentRegistry from './dms/ComponentRegistry'
import ComponentRegistry from '~/component_registry'


import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/selector"
registerComponents(ComponentRegistry)
registerDataType("selector", Selector)



export default { 
  ...dmsPageFactory(siteConfig({ 
    app: "dms-site",
    type: "docs-page",
    logo: <Logo />, 
    rightMenu: <AuthMenu />,
    baseUrl: "",
    checkAuth
  }), "/",  withAuth),
  name: "CMS",
  sideNav: {
    size: "none"
  },
  topNav: {
    size: "none"
  }
}