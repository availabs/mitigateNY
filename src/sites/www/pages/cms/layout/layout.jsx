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
  },
  navPadding: {
    1: 'pt-0 ',
    2: 'md:pt-12 pt-0',
    3: 'md:pt-24 pt-0'
  } 
}

export default function SiteLayout ({children, dataItems, edit, baseUrl='', ...props}) {
  const [open, setOpen] = React.useState(false)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  // console.log('siteLayout', open)
  
  const menuItems = React.useMemo(() => {
    let items = dataItemsNav(dataItems,baseUrl,edit)
    return items
  }, [dataItems,edit])

  const level = detectNavLevel(dataItems, baseUrl);

  const inPageNav = getInPageNav(dataItems, baseUrl);
  return (
    
          <CMSContext.Provider value={{baseUrl, open, setOpen, historyOpen, setHistoryOpen}}>
            {children}
          </CMSContext.Provider>
    
  )
}

