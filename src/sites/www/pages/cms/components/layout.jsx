import React from 'react'
import { NavLink, Link, useSubmit } from "react-router-dom";
import Layout from '~/layout/avail-layout'
import {dataItemsNav, detectNavLevel} from './utils/navItems'
import {getInPageNav} from "./utils/inPageNavItems.js";

export const CMSContext = React.createContext(undefined);

const theme = {
  layout: {
    page: 'h-full w-full bg-slate-100 flex flex-col',
    container: 'w-full flex-1 flex flex-col',
    // content: 'border flex-1 bg-white'
  },
  navPadding: {
    1: 'pt-0',
    2: 'pt-12',
    3: 'pt-24'
  }
}

export default function SiteLayout ({children, dataItems, edit, baseUrl='', ...props},) {
  // console.log('children', dataItems)
  const menuItems = React.useMemo(() => {
    let items = dataItemsNav(dataItems,baseUrl,edit)
    if(edit) {
      items.push( {
        id: '',
        onClick: () => console.log('add page'),
        name: 'Add Page'
      })
    }
    return items
  }, [dataItems,edit])

  const level = detectNavLevel(dataItems, baseUrl);

  const inPageNav = getInPageNav(dataItems, baseUrl);
  return (
    <Layout topNav={{menuItems, position: 'fixed' }} sideNav={edit ? props.sideNav : inPageNav}>
      <div className={`${theme.layout.page} ${theme.navPadding[level]}`}>
        <div className={theme.layout.container}>
          <CMSContext.Provider value={{baseUrl}}>
            {children}
          </CMSContext.Provider>
        </div>
      </div>
    </Layout>
  )
}

