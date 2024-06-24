//
// import { menuItems } from "../index"
// import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
// import { withAuth } from "~/modules/ams/src"
// import checkAuth  from "~/layout/checkAuth"
// import Logo from '~/layout/Logo'
// import AuthMenu from "~/pages/Auth/AuthMenu"
// import { useFalcor } from "~/modules/avl-falcor"
//
// import siteConfig from '~/modules/dms/src/patterns/page/searchConfig'
//
// import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/components/selector"
// import {API_HOST} from "../../../../../config.js";
// registerDataType("selector", Selector)
//
// export default {
//   ...dmsPageFactory(siteConfig({
//     app: "dms-site",
//     type: "docs-play",
//     logo: <div />,
//     rightMenu: <AuthMenu />,
//     useFalcor,
//     baseUrl: "/playground/search",
//     API_HOST,
//     checkAuth
//   }), withAuth),
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
