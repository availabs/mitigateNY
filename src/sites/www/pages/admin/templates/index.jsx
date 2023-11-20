
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import { menuItems } from "../index"



import templatesConfig from './templatesConfig'

import Selector from "~/sites/www/pages/cms/dms/selector"
registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory(templatesConfig, "/admin/templates/",  withAuth),
  name: "Templates",
  sideNav: {
    size: "compact",
    color: 'white',
    menuItems
  },
  topNav: {
    position: 'fixed'
  }
  
}