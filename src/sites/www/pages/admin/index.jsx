import React from 'react';

export const menuItems = [
  {
    name: 'Dashboard',
    icon: 'far fa-home fa-fw',
    path: '/admin'
  },
  {
    name: 'Admin', 
    //path: '/auth/someplace',
    className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
  },
  {
    name: 'Plan Status',
    icon: 'far fa-gauge-simple fa-fw',
    path: '/admin'
  },
  {
    name: 'CMS',
    icon: 'far fa-edit fa-fw',
    path: '/edit'
  },
  {
    name: 'Templates',
    icon: 'far fa-paste fa-fw',
    path: '/admin/plans'
  },


  {
    name: 'Data', 
    //path: '/auth/someplace',
    className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
  },
  {
    name: 'Cen Rep',
    icon: 'far fa-database fa-fw',
    path: '/cenrep'
  },
  {
    name: 'Playground',
    icon: 'far fa-flask fa-fw',
    path: '/playground/edit'
  },

  {
    name: 'Forms', 
    //path: '/auth/someplace',
    className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
  },
  {
    name: 'Actions',
    icon: 'far fa-building fa-fw',
    path: '/admin/forms/actions'
  },
  {
    name: 'Capabilities',
    icon: 'far fa-warehouse-full fa-fw',
    path: '/admin/forms/actions'
  },
  {
    name: 'Roles',
    icon: 'far fa-people-arrows',
    path: '/admin/forms/actions'
  },
  {
    name: 'Zones',
    icon: 'far fa-vector-polygon',
    path: '/admin/forms/actions'
  },
  {
    name: 'Agencies',
    icon: 'far fa-flag',
    path: '/admin/forms/actions'
  },
  {
    name: 'Tools', 
    //path: '/auth/someplace',
    className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
  },
  {
    name: 'Scenario Map',
    icon: 'far fa-map-pin fa-fw',
    path: '/admin/forms/actions'
  },
  {
    name: 'State Assets',
    icon: 'far fa-landmark fa-fw',
    path: '/admin/forms/actions'
  }
]

export const authMenuConfig = {
  sideNav: {
    size: 'full',
    color: 'white',
    menuItems
  },
  topNav: {
    position: 'fixed'
  },
}

const Home = () => 
  <div className='h-full flex-1 flex flex-col text-gray-900 bg-slate-100'>
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className="text-6xl font-bold">Home Page</div>
        <div className="text-xl">Put something here</div>
        <div className="text-xl"></div>
      </div>
  </div>

const config = {
  name:'Title',
  path: "/admin",
  exact: true,
  auth: false,
  mainNav: false,
  ...authMenuConfig,
  component: Home
}

export default config;