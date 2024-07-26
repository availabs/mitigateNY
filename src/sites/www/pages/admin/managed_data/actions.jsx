import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"
//import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import formsConfig from '~/modules/dms/src/patterns/forms'

import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { menuItems } from "../index"
import { useFalcor } from "~/modules/avl-falcor"

import {API_HOST} from "~/config.js";
import { pgEnv } from "~/utils";
//registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(formsConfig({ 
    app: "dms-site",
    type: "docs-draft",
    pgEnv,
    baseUrl: "/actions",
    logo: <div />,
    useFalcor,
    rightMenu: <AuthMenu />,
    API_HOST,
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
