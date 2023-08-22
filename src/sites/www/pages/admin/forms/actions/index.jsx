import React from "react"
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import { withAuth } from "~/modules/ams/src" 
//import Layout from "../../cms/components/layout"
import checkAuth  from "~/layout/checkAuth"


import cmsFormat from "./actions.format.js"

import { menuItems } from "../../index"

// registerDataType("selector", Selector)

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
      type: 'dms-table',
      action: "list",
      path: "/",
      options: {
        columns: [
            { type: 'link',
                name: 'Name',
                text: ':name',
                to: '/action/:id',
                filter: "fuzzyText"
              },
               {name:'type'}, {name:'description'}]
      }
      // filter: {
      //   mainNav: true, 
      //   attributes:['title', 'index', 'url_slug', 'parent' ]
      // },
    },
    { 
          type: "dms-card",
          path: '/action/:id?',
          action: 'view',
          options: {
            mapDataToProps: {
              title: "item:data.name",
              body: [
                "item:data.description",
              ],
              footer: [
                "item:updated_at"
              ]
            },
          }
          
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: '/new',
          redirect: '/admin/forms/actions'
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: '/edit/:id?'
        },
  ]
}

export default { 
  ...dmsPageFactory(siteConfig, "/admin/forms/actions/",  withAuth),
  name: "Actions",
  sideNav: {
    size: 'compact',
    color: 'white',
    menuItems
  },
  topNav: {
    size: "none"
  }
}