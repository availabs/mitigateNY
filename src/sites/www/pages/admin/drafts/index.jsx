import React from "react"
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
import Layout from "../../cms/layout/layout"
import checkAuth  from "~/layout/checkAuth"
import { PageView, PageEdit } from "../../cms/layout/page"

import Selector from "../../cms/dms/selector"

import cmsFormat from "./drafts.format.js"

import { menuItems } from "../index"

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
      type: (props) => (
        <Layout 
        {...props}
        sideNav={{size: 'miniPad'}} 
        baseUrl={'/drafts'}
        />
      ),
      action: "list",
      path: "/*",
      filter: {
        mainNav: true, 
        attributes:['title', 'index', 'url_slug', 'parent' ]
      },
      children: [
        { 
          type: PageView,
          path: "/*",
          action: "view"
        },
      ]
    },
    { 
      type: (props) => (
        <Layout 
          {...props} 
          edit={true} 
          sideNav={{size: 'miniPad'}} 
          baseUrl={'/drafts'}
        />
      ),
      action: "list",
      path: "/edit/*",
      authLevel: 5,
      filter: {
        mainNav: true, 
        attributes:['title', 'index', 'url_slug', 'parent' ]
      },
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
  ...dmsPageFactory(siteConfig, "/drafts/",  withAuth),
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