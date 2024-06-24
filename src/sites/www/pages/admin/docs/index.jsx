import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"
import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { menuItems } from "../index"
import { useFalcor } from "~/modules/avl-falcor"

import {API_HOST} from "~/config.js";

registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(siteConfig({ 
    app: "dms-site",
    type: "docs-docs",
    logo: <div />,
    useFalcor,
    rightMenu: <AuthMenu />,
    baseUrl: "/admin/docs",
    API_HOST,
    checkAuth
  }), withAuth),
  name: "Classroom",
  sideNav: {
    size: 'mini',
    color: 'white',
    menuItems
  },
  topNav: {
    size: "none"
  }
}
