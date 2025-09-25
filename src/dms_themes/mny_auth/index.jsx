import React from 'react'
import { Link } from 'react-router'



const theme = {
  navOptions: {
    logo: '',
    sideNav: {
      size: 'none',
      search: 'none',
      logo: 'top',
      dropdown: 'top',
      nav: 'none'
    },
    topNav: {
      size: 'compact',
      dropdown: 'right',
      search: 'right',
      logo: 'left',
      position: 'fixed',
      nav: 'main'
    }
  },
    logo: {
        logoWrapper: "",
        logoAltImg: "",
        imgWrapper: "h-12 pl-3 pr-2 flex items-center",
        img: "/themes/mny/mnyLogo.svg",
        titleWrapper: "",
        title: "",
        linkPath: "/",
    },
    loginButton: "flex-1 flex justify-center w-full bg-[#C5D7E0] rounded-full px-[12px] py-[8px]",
    signupButton: "flex-1 flex justify-center w-full bg-[#C5D7E0] rounded-full px-[12px] py-[8px]",
    forgotPasswordButton: "flex-1 flex justify-center w-full bg-[#C5D7E0] rounded-full px-[12px] py-[8px]",
    resetPasswordButton: "flex-1 flex justify-center w-full bg-[#C5D7E0] rounded-full px-[12px] py-[8px]",
  heading: {
    "base": "p-2 w-full font-sans font-medium text-md bg-transparent",
    "1": `font-[500]  text-[#2D3E4C] text-[36px] leading-[36px] tracking-[-.02em] font-[500] underline-offset-8 underline decoration-4 decoration-[#EAAD43] uppercase font-['Oswald'] pb-[12px]`,
    "2": `font-[500]  text-[#2D3E4C] text-[24px] leading-[24px] scroll-mt-36 font-['Oswald'] pb-[12x]`,
    "3": `font-[500]  text-[#2D3E4C] text-[16px] leading-[16px] scroll-mt-36 font-['Oswald'] pb-[12x]`,
    "default": ''
  },
  levelClasses: {
    '1': ' pt-2 pb-1 uppercase text-sm text-blue-400 hover:underline cursor-pointer border-r-2 mr-4',
    '2': 'pl-2 pt-2 pb-1 uppercase text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
    '3': 'pl-4 pt-2 pb-1 text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
    '4': 'pl-6 pt-2 pb-1 text-sm text-slate-400 hover:underline cursor-pointer border-r-2 mr-4',
  },
  layout: {
      wrapper: "max-w-[1440px] mx-auto",
      wrapper2: "flex-1 flex items-start flex-col items-stretch max-w-full",
      wrapper3: "flex flex-1 md:px-4 xl:px-[64px]",
    childWrapper: 'h-full flex-1',
      topnavContainer1: 'print:hidden',
      topnavContainer2: `fixed top-0 z-20 max-w-[1440px] left-50% -translate-50% w-full md:px-4 md:pt-[32px] xl:px-[64px] pointer-events-none`,
    sidenavContainer1: 'pr-2  hidden lg:block min-w-[222px] max-w-[222px]',
    sidenavContainer2: 'hidden lg:block fixed min-w-[222px] max-w-[222px] top-[0px] h-[calc(100vh_-_1px)] bg-white hadow-md w-full overflow-y-auto overflow-x-hidden'
  },
  page: {
    container: `bg-[linear-gradient(0deg,rgba(244,244,244,0.96),rgba(244,244,244,0.96)),url('/themes/mny/topolines.png')]  bg-[size:500px] pb-[4px]`,//`bg-gradient-to-b from-[#F4F4F4] to-[#F4F4F4] bg-[url('/themes/mny/topolines.png')] `,
    wrapper1: 'w-full h-full flex-1 flex flex-col ', // first div inside Layout
    wrapper2: 'w-full h-full flex-1 flex flex-row p-4 min-h-screen', // inside page header, wraps sidebar
    wrapper3: 'flex flex-1 w-full border-2 flex-col border shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4' , // content wrapepr
    iconWrapper : 'z-5 absolute right-[10px] top-[5px]',
    icon: 'text-slate-400 hover:text-blue-500'
  },

  sectionArray: {
    container: 'w-full grid grid-cols-6 md:grid-cols-12 ',
    layouts: {
        centered: 'max-w-[1440px] mx-auto md:gap-[12px] px-0 lg:px-[56px]',
        fullwidth: 'md:gap-[12px] px-0 lg:px-[56px'
    },
    sizes: {
        "1/4": { className: 'col-span-6 md:col-span-3', iconSize: 25 },
        "1/3": { className: 'col-span-6 md:col-span-4', iconSize: 33 },
        "1/2": { className: 'col-span-6 md:col-span-6', iconSize: 50 },
        "2/3": { className: 'col-span-6 md:col-span-8', iconSize: 66},
        "1": { className: 'col-span-6 md:col-span-9', iconSize: 75 },
        "2":   { className: 'col-span-6 md:col-span-12', iconSize: 100 },
    }
  },
  pageControls: {
    controlItem: 'pl-6 py-0.5 text-md cursor-pointer hover:text-blue-500 text-slate-400 flex items-center',
    select: 'bg-transparent border-none rounded-sm focus:ring-0 focus:border-0 pl-1',
    selectOption: 'p-4 text-md cursor-pointer hover:text-blue-500 text-slate-400 hover:bg-blue-600',
  },
  navPadding: {
    1: '',
    2: '',
    3: ''
  },
  lexical: {
    editorShell: "font-['Proxima_Nova'] font-[400] text-[16px] text-[#37576B] leading-[22.4px]",
    heading: {
      h1: "font-[500]  text-[#2D3E4C] text-[36px] leading-[36px] tracking-[-.02em] font-[500] underline-offset-8 underline decoration-4 decoration-[#EAAD43] uppercase font-['Oswald'] pb-[12px]", //'PlaygroundEditorTheme__h1',
      h2: "font-[500]  text-[#2D3E4C] text-[24px] leading-[24px] scroll-mt-36 font-['Oswald'] pb-[12x]", //'PlaygroundEditorTheme__h2',
      h3: "font-[500]  text-[#2D3E4C] text-[16px] leading-[16px] scroll-mt-36 font-['Oswald'] pb-[12x]", //'PlaygroundEditorTheme__h3',
      h4: "font-medium text-[#2D3E4C] scroll-mt-36 font-display", //'PlaygroundEditorTheme__h4',
      h5: "scroll-mt-36 font-display", //'PlaygroundEditorTheme__h5',
      h6: "scroll-mt-36 font-display", //'PlaygroundEditorTheme__h6',
    },
    paragraph: "m-0 relative", //'PlaygroundEditorTheme__paragraph',
    quote:
    "m-0 mb-2 font-['Oswald'] text-[30px] leading-[36px] text-[#2D3E4C] border-l-4 border-[#37576B] pl-4 pb-[12px]", //'PlaygroundEditorTheme__quote',

  },
    field: {
      label: 'font-normal font-[Proxima Nova] text-[14px] leading-[140%]'
    },
    loginPage: {
      titleText: 'MitigateNY',
        titleWrapper: 'text-[#37576B] font-semibold text-xl',
    },
  dataCard: {
    columnControlWrapper: 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-0.5',
    columnControlHeaderWrapper: `px-1 font-semibold border bg-gray-50 text-gray-500`,

    mainWrapperCompactView: 'grid',
    mainWrapperSimpleView: 'flex flex-col',

    subWrapper: 'w-full text-[#2D3E4C] font-[Oswald]',
    subWrapperCompactView: 'flex flex-col flex-wrap rounded-[12px] divide-y',
    subWrapperSimpleView: 'grid',

    headerValueWrapper: 'w-full rounded-[12px] flex items-center gap-[8px] justify-center p-2',
    headerValueWrapperCompactView: 'rounded-none py-[12px]',
    headerValueWrapperSimpleView: '',
    justifyTextLeft: 'w-full text-start rounded-md px-1 py-0.5',
    justifyTextRight: 'text-end rounded-md px-1 py-0.5',
    justifyTextCenter: 'text-center rounded-md px-1 py-0.5',

    textXS: 'font-medium font-[Oswald] text-[12px] leading-[140%]',
    textXSReg: 'font-normal font-[Proxima Nova] text-[12px] leading-[100%] uppercase',
    textSM: 'font-medium font-[Oswald] text-[14px] leading-[100%] uppercase',
    textSMReg: 'font-normal font-[Proxima Nova] text-[14px] leading-[140%]',
    textSMBold: 'font-normal font-[Proxima Nova] text-[14px] leading-[140%]',
    textSMSemiBold: 'font-semibold font-[Proxima Nova] text-[14px] leading-[140%]',
    textMD: 'font-medium font-[Oswald] text-[16px] leading-[100%] uppercase',
    textMDReg: 'font-normal font-[Proxima Nova] text-[16px] leading-[140%]',
    textMDBold: 'font-bold font-[Proxima Nova] text-[16px] leading-[140%]',
    textMDSemiBold: 'font-semibold font-[Proxima Nova] text-[16px] leading-[140%]',
    textXL: 'font-medium font-[Oswald] text-[20px] leading-[100%] uppercase',
    textXLSemiBold: 'font-semibold font-[Proxima Nova] text-[20px] leading-[120%]',
    text2XL: 'font-medium font-[Oswald] text-[24px] leading-[100%] uppercase',
    text2XLReg: 'font-regular font-[Oswald] text-[24px] leading-[120%] uppercase',
    text3XL: 'font-medium font-[Oswald] text-[30px] leading-[100%] uppercase tracking-[-0.05em]',
    text3XLReg: 'font-normal font-[Oswald] text-[30px] leading-[120%] uppercase',
    text4XL: 'font-medium font-[Oswald] text-[36px] leading-[100%] uppercase tracking-[-0.05em]',
    text5XL: 'font-medium font-[Oswald] text-[48px] leading-[100%] uppercase tracking-[-0.05em]',
    text6XL: 'font-medium font-[Oswald] text-[60px] leading-[100%] uppercase',
    text7XL: 'font-medium font-[Oswald] text-[72px] leading-[100%] uppercase tracking-normal',
    text8XL: 'font-medium font-[Oswald] text-[96px] leading-[95%] uppercase tracking-normal ',

    header: 'w-full flex-1 uppercase text-[#37576B]',
    headerCompactView: '',
    headerSimpleView: '',
    value: 'w-full text-[#2D3E4C]',
    valueCompactView: '',
    valueSimpleView: ''
  },
  sidenav: {
    fixed: ``,
   "logoWrapper": "full p-2 bg-neutral-100 text-slate-800",
   "topNavWrapper": "flex flex-row md:flex-col p-2", //used in layout
   "sidenavWrapper": "hidden md:block border-r w-full h-full z-20",
   "menuItemWrapper": "flex flex-col hover:bg-blue-50",
   "menuIconSide": "group px-2 mr-2 text-blue-500  group-hover:text-blue-800",
   "menuIconSideActive": "group px-2 w-6 mr-2 text-blue-500  group-hover:text-blue-800",
   "itemsWrapper": "border-slate-200 pt-5  ",
   "navItemContent": "transition-transform duration-300 ease-in-out flex-1",
   "navItemContents": ['text-[14px] font-light text-slate-700 px-4 py-2'],
   "navitemSide": `
    group  flex flex-col
    group flex
    focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
    transition-all cursor-pointer border-l-2 border-white`,
   "navitemSideActive": `
    group  flex flex-col
      focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
    transition-all cursor-pointer border-l-2 border-blue-500`,
   "indicatorIcon": "ArrowRight",
   "indicatorIconOpen": "ArrowDown",
   "indicatorIconWrapper" : "size-4 text-[#37576B]",
   "subMenuWrappers": ['w-full bg-[#F3F8F9] rounded-[12px]','w-full bg-[#E0EBF0]'],
   "subMenuOuterWrappers": ['pl-4'],
   "subMenuWrapper": "pl-2 w-full",
   "subMenuParentWrapper": "flex flex-col w-full",
   "bottomMenuWrapper": ""
  },
  topnav: {
      fixed: 'mt-8',
      topnavWrapper: `px-[24px] py-[16px] w-full bg-white h-20 flex items-center rounded-lg shadow pointer-events-auto`,
      topnavContent: `flex items-center w-full h-full  max-w-[1400px] mx-auto `,
      topnavMenu: `hidden  md:flex items-center flex-1  h-full overflow-x-auto overflow-y-hidden scrollbar-sm`,
      menuItemWrapper: 'flex text-[#37576B]',
      menuIconTop: `text-blue-400 mr-3 text-lg group-hover:text-blue-500`,
      menuIconTopActive : `text-blue-500 mr-3 text-lg group-hover:text-blue-500`,
      menuOpenIcon: `fa-light fa-bars fa-fw`,
      menuCloseIcon: `fa-light fa-xmark fa-fw"`,
      navitemTop: `
          w-fit group font-display whitespace-nowrap
          flex tracking-widest items-center font-[Oswald] font-medium text-slate-700 text-[11px] px-2 h-12
          focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
          transition cursor-pointer
      `,
      navitemTopActive:
        ` w-fit group font-display whitespace-nowrap
          flex tracking-widest items-center font-[Oswald] font-medium text-slate-700 text-[11px] px-2 h-12 text-blue
          focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300
          transition cursor-pointer
        `,
      //`px-4 text-sm font-medium tracking-widest uppercase inline-flex items-center  border-transparent  leading-5 text-white hover:bg-white hover:text-darkblue-500 border-gray-200 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out h-full`,
      topmenuRightNavContainer: "hidden md:flex h-full items-center",
      topnavMobileContainer: "bg-slate-50",

      mobileButton:`md:hidden bg-slate-100 inline-flex items-center justify-center pt-[12px] px-2 hover:text-blue-400  text-gray-400 hover:bg-gray-100 `,
      indicatorIcon: 'fal fa-angle-down pl-2 pt-1',
      indicatorIconOpen: 'fal fa-angle-down pl-2 pt-1',
      subMenuWrapper: `hidden`,
      subMenuParentWrapper: 'hidden',
      subMenuWrapperChild: `divide-x overflow-x-auto max-w-[1400px] mx-auto`,
      subMenuWrapperTop: 'hidden',
      subMenuWrapperInactiveFlyout: `absolute left-0 right-0  mt-8 normal-case bg-white shadow-lg z-10 p-2`,
      subMenuWrapperInactiveFlyoutBelow: ` absolute ml-40 normal-case bg-white shadow-lg z-10 p-2`,
      subMenuWrapperInactiveFlyoutDirection: 'grid grid-cols-4'

  },
  table: {
      tableContainer: 'relative flex flex-col w-full h-full overflow-x-auto scrollbar-sm border rounded-t-[12px]',
      tableContainerNoPagination: 'rounded-b-[12px]',
      tableContainer1: 'flex flex-col no-wrap min-h-[200px] max-h-[calc(78vh_-_10px)] overflow-y-auto scrollbar-sm',
      headerContainer: 'sticky top-0 grid ',
      thead: 'flex justify-between',
      theadfrozen: '',
      thContainer: 'w-full font-[500] py-4 pl-4 pr-0 font-[Oswald] text-[12px] uppercase text-[#2d3e4c] border-x',
      thContainerBg: 'bg-[#F3F8F9] text-gray-900',
      thContainerBgSelected: 'bg-gray-50 text-gray-900',
      cell: 'relative flex items-center min-h-[36px]  border border-slate-50',
      cellInner: `
          w-full min-h-full flex flex-wrap items-center truncate py-1 px-2
          font-['Proxima_Nova'] font-[400] text-[14px] text-[#37576B] leading-[20px]
      `,
      cellBg: 'bg-white',
      cellBgSelected: 'bg-blue-50',
      cellFrozenCol: '',
      paginationContainer: 'w-full p-2 rounded-b-[12px] bg-[#F3F8F9] flex items-center justify-between',
      paginationInfoContainer: '',
      paginationPagesInfo: 'font-[500] font-[Oswald] text-[12px] uppercase text-[#2d3e4c] leading-[18px]',
      paginationRowsInfo: 'text-xs font-[Proxima Nova] leading-[14px]',
      paginationControlsContainer: 'flex flex-row items-center border rounded-[8px] overflow-hidden',
      pageRangeItem: 'cursor-pointer px-[12px]  py-[7px] font-[Oswald] font-[500] text-[12px] border-r last:border-none uppercase leading-[18px]' ,
      pageRangeItemInactive: 'bg-white text-[#2D3E4C]',
      pageRangeItemActive: 'bg-[#2D3E4C] text-white',
      openOutContainerWrapper: 'absolute inset-0 right-0 h-full w-full z-[100]',
      openOutHeader: 'font-semibold font-[Proxima Nova] text-[#37576B] text-[14px] leading-[17.05px]',
      openOutValue: 'font-normal font-[Proxima Nova] text-[#37576B] text-[14px] leading-[19.6px]',
      openOutTitle: 'font-medium font-[Oswald] text-[24px] leading-[100%] uppercase text-[#2D3E4C]'
  },
  attribution: {
    wrapper: 'w-full flex flex-col gap-[4px] text-[#2D3E4C] text-xs',
    label: 'font-semibold text-[12px] leading-[14.62px] border-t pt-[14px]',
    link: 'font-normal leading-[14.62px] text-[12px] underline'
  },
    sectionGroup: {
        default: {
            wrapper1: "w-full h-full flex-1 flex flex-row pt-2", // inside page header, wraps sidebar
            wrapper2:
                "flex flex-1 w-full  flex-col  shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4 h-full min-h-[200px]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
            sideNavContainer1: "hidden xl:block",
            sideNavContainer2:
                "min-w-[302px] max-w-[302px] sticky top-20 hidden xl:block h-[100vh_-_102px] pr-2",
        },
        content: {
            wrapper1: "w-full h-full flex-1 flex flex-row lg:pt-[118px] ", // inside page header, wraps sidebar
            wrapper2:
                "flex flex-1 w-full  flex-col  shadow-md bg-white rounded-lg relative text-md font-light leading-7 p-4 h-full min-h-[calc(100vh_-_200px)]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
        },
        darkSection: {
            wrapper1: `w-full h-full flex-1 flex flex-row -my-8 py-10 bg-[linear-gradient(0deg,rgba(33,52,64,.96),rgba(55,87,107,.96)),url('/themes/mny/topolines.png')]  bg-[size:500px] pb-[4px]`, // inside page header, wraps sidebar
            wrapper2: "max-w-[1440px]  xl:px-[64px] md:px-4 mx-auto",
            wrapper3:
                "flex flex-1 w-full  flex-col  relative text-md font-light leading-7 p-4 h-full min-h-[200px]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
        },
        lightCentered: {
            wrapper1: `w-full h-full flex-1 flex flex-row pb-[4px] `, // inside page header, wraps sidebar
            wrapper2: "max-w-[1440px]  xl:px-[64px] md:px-4 mx-auto",
            wrapper3:
                "flex flex-1 w-full  shadow-md bg-white rounded-lg  flex-col  relative text-md font-light leading-7 p-4 h-full min-h-[200px]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
        },
        clearCentered: {
            wrapper1: `w-full h-full flex-1 flex flex-row -mt-3`, // inside page header, wraps sidebar
            wrapper2: "max-w-[1440px] w-full xl:px-[48px] mx-auto",
            wrapper3: "flex flex-1 w-full flex-col relative h-full min-h-[200px]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
        },
        header: {
            wrapper1: "w-full h-full flex-1 flex flex-row", // inside page header, wraps sidebar
            wrapper2: "flex flex-1 w-full  flex-col  relative min-h-[200px]", // content wrapepr
            iconWrapper: "z-5 absolute right-[10px] top-[5px] print:hidden",
            icon: "text-slate-400 hover:text-blue-500",
        },
    },
}

//theme.navOptions.logo = <Link to='/' className='h-12 flex px-4 items-center'><div className='rounded-full h-10 bg-blue-500 border border-slate-50' /></Link>

export default theme

export const themeOptions = {
  "topNav": {
    "label": "Top Nav",
    "defaultOpen": true,
    "controls": {
      "size": {
        "label": "Size",
        "type": "select",
        "options": [
          "none",
          "compact"
        ]
      },
      "logo": {
        "label": "Logo",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "search": {
        "label": "Search",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "dropdown": {
        "label": "Menu",
        "type": "select",
        "options": [
          "none",
          "left",
          "right"
        ]
      },
      "nav": {
        "label": "Navigation",
        "type": "select",
        "options": [
          "none",
          "main",
          "secondary"
        ]
      }
    }
  },
  "sideNav": {
    "label": "Side Nav",
    "defaultOpen": false,
    "controls": {
      "size": {
        "label": "Size",
        "type": "select",
        "options": [
          "none",
          "full"
        ]
      },
      "depth": {
        "label": "Depth",
        "type": "select",
        "options": [
          1,2
        ]
      },
      "logo": {
        "label": "Logo",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "search": {
        "label": "Search",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "dropdown": {
        "label": "Menu",
        "type": "select",
        "options": [
          "none",
          "top",
          "bottom"
        ]
      },
      "nav": {
        "label": "Navigation",
        "type": "select",
        "options": [
          "none",
          "main",
          "secondary"
        ]
      }
    }
  },
  "secondaryNav": {
    "label": "Secondary Nav",
    "defaultOpen": false,
    "controls": {
      "navItems": {
        "label": "Nav Items",
        "type": "menu"
      }
    }
  },
  "authMenu": {
    "label": "Auth Menu",
    "defaultOpen": false,
    "controls": {
      "navItems": {
        "label": "Nav Items",
        "type": "menu"
      }
    }
  }
}
