import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"

import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'
import { menuItems } from "../index"

import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { useFalcor } from "~/modules/avl-falcor"


registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(siteConfig({ 
    app: "dms-site",
    type: "docs-play",
    logo: <div />, 
    rightMenu: <AuthMenu />,
    useFalcor,
    baseUrl: "/playground",
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
