import { dmsPageFactory, registerDataType } from "~/modules/dms/src"

import { withAuth } from "~/modules/ams/src" 

import Selector from "../cms/dms/selector"

import checkAuth  from "~/layout/checkAuth"

import { PageView, PageEdit } from "../cms/layout/page"
import Layout from "../cms/layout/layout"

import devFormat from "./dev.format.js"

registerDataType("selector", Selector)

export default { 
  ...dmsPageFactory({
  format: devFormat,
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
      type: (props) => <Layout 
        {...props}
        baseUrl={'/dev'}
        />,
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
      type: (props) =>  <Layout 
        {...props}
        edit={true}
        baseUrl={'/dev'}
        />,
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
}, "/dev/",  withAuth),
  name: "Dev",
  sideNav: {
    size: "none"
  },
  topNav: {
    size: "none"
  }
}