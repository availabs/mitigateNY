import React from 'react'
import { 
  registerDataType,
  dmsPageFactory
} from '~/modules/dms'

import DmsLexical from '~/modules/dms-custom/lexical'
import Layout from './components/layout'
import { PageView, PageEdit } from './components/page'
import docsFormat from './docs.format.js'

registerDataType('lexical', DmsLexical)

const siteConfig = {
  format: docsFormat,
  children: [
    { 
      type: Layout,
      action: 'list',
      path: '/*',
      children: [
        // { 
        //   type: PageView,
        //   path: '/:url_slug?',
        //   action: 'view'
        // },
        { 
          type: PageView,
          path: '/*',
          action: 'view'
        },
      ]
    },
    { 
      type: (props) => <Layout {...props} edit={true}/>,
      action: 'list',
      path: '/edit/*',
      children: [
        { 
          type: PageEdit,
          action: 'edit',
          path: '/edit/*'
        },
      ]
    }
  ]
}

export default dmsPageFactory(siteConfig)