import React from 'react'
import { NavLink, Link, useSubmit } from "react-router-dom";
import Layout from '~/layout/avail-layout'
import {dataItemsNav} from './utils/navItems'

export const CMSContext = React.createContext(undefined);

const theme = {
  layout: {
    page: 'h-full w-full bg-slate-100 flex flex-col',
    container: 'w-full flex-1 flex flex-col',
    // content: 'border flex-1 bg-white'
  },
  navPadding: {
    1: 'pt-0',
    2: 'pt-8',
    3: 'pt-20'
  }
}

const detectNavLevel = (dataItems) => {
  const location = window.location.pathname.replace('/', '');
  const isMatch = dataItems.find(d => d.url_slug === location);
  const isParent = dataItems.filter(d => d.parent === isMatch?.id).length;
  const level = isMatch ? location.split('/').length : 1

  console.log('???', location, isMatch, )
  return level + (isParent ? 1 : 0)

}
export default function SiteLayout ({children, dataItems, edit, baseUrl='', ...props},) {
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

  const level = detectNavLevel(dataItems);

  return (
    <Layout topNav={{menuItems, position: 'fixed' }} sideNav={props.sideNav}>
      <div className={`${theme.layout.page} ${theme.navPadding[level]}`}>
        <div className={theme.layout.container}>
          <CMSContext.Provider value={{baseUrl: baseUrl}}>
            {children}
          </CMSContext.Provider>
        </div>
      </div>
    </Layout>
  )
}

