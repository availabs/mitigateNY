import checkAuth  from "~/layout/checkAuth"
import { PageView, PageEdit } from "./components/page"
import Layout from "./components/layout"
import cmsFormat from "./cms.format.js"

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

export default siteConfig