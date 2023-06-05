import React from "react"
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import Layout from "../cms/components/layout"
import checkAuth  from "~/layout/checkAuth"
import { PageView, PageEdit } from "../cms/components/page"

import Selector from "../cms/dms/selector"

import cmsFormat from "./cms.format.js"

registerDataType("selector", Selector)

const siteConfig = {
  format: cmsFormat,
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
      type: Layout,
      action: "list",
      path: "/*",
      children: [
        { 
          type: PageView,
          path: "/*",
          action: "view"
        },
      ]
    },
    { 
      type: (props) => <Layout {...props} edit={true}/>,
      action: "list",
      path: "/edit/*",
      authLevel: 5,
      children: [
        { 
          type: PageEdit,
          action: "edit",
          path: "/edit/*"
        },
      ]
    }
  ]
}

export default { 
  ...dmsPageFactory(siteConfig, "/",  withAuth),
  name: "CMS",
  sideNav: {
    size: "none"
  },
  topNav: {
    size: "none"
  }
}