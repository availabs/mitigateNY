import { dmsPageFactory, registerDataType, registerComponents, Selector } from "~/modules/dms/src"
import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import Logo from '~/layout/Logo'
import AuthMenu from "~/pages/Auth/AuthMenu"
import { menuItems } from "../index"
import { useFalcor } from "~/modules/avl-falcor"

<<<<<<< HEAD

=======
import {siteConfig} from '~/modules/dms/src/patterns/page/siteConfig'

import Selector, { registerComponents } from "~/modules/dms/src/patterns/page/components/selector"
import {API_HOST} from "../../../../../config.js";
>>>>>>> 0f04baa2a0059a4d6b005ba05553e93aaffe59a6
registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(siteConfig({ 
    app: "dms-site",
    type: "docs-draft",
    logo: <div />,
    useFalcor,
    rightMenu: <AuthMenu />,
    baseUrl: "/drafts",
    API_HOST,
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
