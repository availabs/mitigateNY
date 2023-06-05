import React from 'react'
import { NavLink, Link, useSubmit } from "react-router-dom";
import Layout from '~/layout/avail-layout'
import {dataItemsNav} from './utils/navItems'

const theme = {
  layout: {
    page: 'h-full w-full bg-slate-100 flex flex-col pt-5',
    container: 'w-full flex-1 flex flex-col',
    // content: 'border flex-1 bg-white'
  }
}

export default function SiteLayout ({children, dataItems,edit, ...props},) {
  const menuItems = React.useMemo(() => {
    return dataItemsNav(dataItems,edit)
  }, [dataItems,edit])
  return (
    <Layout topNav={{menuItems, position: 'fixed'}}>
      <div className={theme.layout.page}>
        <div className={theme.layout.container}> 
          {children}
        </div>
      </div>
    </Layout>
  )
}

