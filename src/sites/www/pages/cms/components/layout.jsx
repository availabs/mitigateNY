import React from 'react'
import { NavLink, Link, useSubmit } from "react-router-dom";
import Layout from '~/layout/avail-layout'
import {dataItemsNav} from './utils/navItems'

export const CMSContext = React.createContext(undefined);

const theme = {
  layout: {
    page: 'h-full w-full bg-slate-100 flex flex-col pt-20',
    container: 'w-full flex-1 flex flex-col',
    // content: 'border flex-1 bg-white'
  }
}

export default function SiteLayout ({children, dataItems,edit, ...props},) {
  const menuItems = React.useMemo(() => {
    return dataItemsNav(dataItems,props.baseUrl || '',edit)
  }, [dataItems,edit])
  //console.log('menuItems', menuItems)
  return (
    <Layout topNav={{menuItems, position: 'fixed' }} sideNav={props.sideNav}>
      <div className={theme.layout.page}>
        <div className={theme.layout.container}>
          <CMSContext.Provider value={{baseUrl: props.baseUrl || ''}}>
            {children}
          </CMSContext.Provider>
        </div>
      </div>
    </Layout>
  )
}

