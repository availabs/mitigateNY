import checkAuth  from "~/layout/checkAuth"
import Layout from "~/modules/dms/src/patterns/page/layout/layout"
import TemplateList from './layout/TemplateList'
import { TemplateEdit } from './layout/TemplateEdit'
import { TemplatePages } from './templatePages'

import templateFormat from "./template.format.js"

const siteConfig = {
  format: templateFormat,
  check: ({user}, activeConfig, navigate) =>  {

    const getReqAuth = (configs) => {
      return configs.reduce((out,config) => {
        let authLevel = config.authLevel || -1
        if(config.children) {
          authLevel = Math.max(authLevel, getReqAuth(config.children))
        }
        return Math.max(out, authLevel)
      },-1)
    } 

    let requiredAuth = getReqAuth(activeConfig)
    checkAuth({user, authLevel:requiredAuth}, navigate)
    
  },
  children: [
    { 
      type: TemplateList,
      action: "list",
      path: "/*",
      lazyLoad: true,
      filter: {
        mainNav: true, 
        attributes:['title', 'index', 'url_slug', 'parent', 'hide_in_nav' ]
      }
    },
    { 
          type: TemplateEdit,
          action: "edit",
          path: "/edit/:id"
    },
    { 
          type: TemplatePages,
          action: "edit",
          path: "/pages/:id"
    }
  ]
}

export default siteConfig