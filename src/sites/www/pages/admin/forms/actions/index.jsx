import React from "react"
import { dmsPageFactory, registerDataType } from "~/modules/dms/src"
import {Link} from 'react-router-dom'
import { withAuth } from "~/modules/ams/src" 
import checkAuth  from "~/layout/checkAuth"
import cmsFormat from "./actions.format.js"

import { menuItems } from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"

// registerDataType("selector", Selector)

const Layout = ({children, title, baseUrl}) =>  (
  <div className='bg-white h-full shadow max-w-6xl mx-auto px-6' >
    <div className='flex items-center'>
      <div className='text-2xl p-3 font-thin flex-1'>{title}</div>
      <div> <Link to={baseUrl} className='text-white bg-blue-500 shadow hover:shadow-lg px-4 py-2'> Nav Link </Link> </div>
    </div>
    {children}
  </div>
)

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
      type: (props) => <Layout {...props} title={'Actions'} baseUrl={'/admin/forms/actions/'}/>,
      path: '/*',
      action: 'list',
      children: [{ 
        type: 'dms-table',
        action: "list",
        path: "/",
        options: {
          columns: [
            { 
            type: 'link',
              name: 'Name',
              text: ':name',
              to: '/admin/forms/actions/:id',
              filter: "fuzzyText"
            },
            { type: 'data',
              name: 'Type',
              path: "type",
            },
            { type: 'data',
              name: 'Descip.',
              path: "description",
            },
              { type: 'date',
              name: 'Updated',
              path: "updated_at",
            },
            { type: 'link',
              name: '',
              to: '/admin/forms/actions/edit/:id',
              text: "edit"
            }
          ]
        }
      },
      { 
        type: "dms-card",
        path: '/:id?',
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
        type: "dms-form-edit",
        action: 'edit',
        path: '/new',
        redirect: '/admin/forms/actions'
      },
      { 
        type: "dms-form-edit",
        action: 'edit',
        path: '/edit/:id?'
      }
      ]
    }
  ]
}

export default { 
  ...dmsPageFactory(
    siteConfig, 
    "/admin/forms/actions/",  
    withAuth,
    dmsFormsTheme
  ),
  name: "Actions",
  sideNav: {
    size: 'compact',
    color: 'white',
    menuItems
  },
  // topNav: {
  //   size: "none"
  // }
}