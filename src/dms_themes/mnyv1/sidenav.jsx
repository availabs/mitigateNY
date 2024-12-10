let sidenav =  {
    fixed: ``,
    logoWrapper: `bg-neutral-100 text-slate-800`,
    sidenavWrapper: `hidden md:block bg-white w-full h-full z-20 pr-4`,
    menuItemWrapper: 'flex flex-col',
    menuIconSide: `group w-6 mr-2 text-blue-500`,
    menuIconSideActive: `group w-6 mr-2 text-blue-500`,
    
    itemsWrapper: `border-slate-200`,
    navItemContent: `transition-transform duration-300 ease-in-out flex-1`,
    navitemSide: `
        group  flex flex-col
        pl-3 py-2 text-[14px] font-[Oswald] font-medium  text-slate-700 ml-2  border-white 
        focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
        transition-all cursor-pointer
     `,
    navitemSideActive: `
        group  flex flex-col
        group flex pl-3 py-2 text-[14px] font-[Oswald] font-medium text-slate-700 ml-2   border-white 
        focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
        transition-all cursor-pointer

      `,
    indicatorIcon: 'fa fa-angle-right pt-2.5',
    indicatorIconOpen: 'fal fa-angle-down pt-2.5',
    subMenuWrapper: `pl-2 w-full`,
    subMenuParentWrapper: `flex flex-col w-full`,
    subMenuWrapperTop: '',
  }

  export default sidenav