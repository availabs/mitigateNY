import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { menuItems } from "../index"
import { useFalcor } from "~/modules/avl-falcor"

import siteConfig from '~/modules/dms/src/patterns/page/siteConfig'

import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/selector"
registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(siteConfig({ 
    app: "dms-site",
    type: "docs-draft",
    logo: <div />,
    useFalcor,
    rightMenu: <AuthMenu />,
    baseUrl: "/drafts",
    checkAuth
  }), withAuth),
  name: "CMS",
  sideNav: {
    size: 'mini',
    color: 'white',
    menuItems
  },
  topNav: {
    size: "none"
  }
}
