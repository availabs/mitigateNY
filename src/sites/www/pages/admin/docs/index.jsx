
// import { menuItems } from "../index"
// import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
// import { withAuth } from "~/modules/ams/src" 
// import checkAuth  from "~/layout/checkAuth"
// import Logo from '~/layout/Logo'
// import AuthMenu from "~/pages/Auth/AuthMenu"

// import siteConfig from '~/modules/dms/src/patterns/page/siteConfig'

// import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/selector"
// registerDataType("selector", Selector)

// export default { 
//   ...dmsPageFactory(siteConfig({ 
//     app: "dms-site",
//     type: "docs-docs",
//     logo: <div />, 
//     rightMenu: <AuthMenu />,
//     baseUrl: "/admin/docs",
//     checkAuth
//   }), "/admin/docs/",  withAuth),
//   name: "CMS",
//   sideNav: {
//     size: 'mini',
//     color: 'white',
//     menuItems
//   },
//   topNav: {
//     size: "none"
//   }
// }
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { menuItems } from "../index"
import { useFalcor } from "~/modules/avl-falcor"

import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/components/selector"
import {API_HOST} from "../../../../../config.js";
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
