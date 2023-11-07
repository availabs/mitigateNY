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
    path: '/admin/plan_status'
  },
  {
    name: 'CMS',
    icon: 'far fa-edit fa-fw',
    path: '/edit'
  },
  {
    name: 'Templates',
    icon: 'far fa-paste fa-fw',
    path: '/admin/templates'
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
    name: 'Forms',
    icon: 'far fa-database fa-fw',
    path: '/admin/forms/list'
  },
  {
    name: 'Playground',
    icon: 'far fa-flask fa-fw',
    path: '/playground/edit'
  },
  {
    name: 'Drafts',
    icon: 'far fa-compass-drafting fa-fw',
    path: '/drafts/edit'
  },
  {
    name: 'Forms', 
    //path: '/auth/someplace',
    className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
  },
  {
    name: 'Actions',
    icon: 'far fa-building fa-fw',
    path: '/admin/forms/form/93165/list/'
  },
  {
    name: 'Capabilities',
    icon: 'far fa-warehouse-full fa-fw',
    path: '/admin/forms/form/130306/list/0/10'
  },
  {
    name: 'Mitigation Measures',
    icon: 'far fa-warehouse-full fa-fw',
    path: '/admin/forms/form/130882/list/0/10'
  },
  {
    name: 'R+V Matrix',
    icon: 'far fa-warehouse-full fa-fw',
    path: '/admin/forms/form/131450/list/0/10'
  },
  {
    name: 'Roles',
    icon: 'far fa-people-arrows',
    path: '/admin/forms/roles'
  },
  {
    name: 'Zones',
    icon: 'far fa-vector-polygon',
    path: '/admin/forms/zones'
  },
  {
    name: 'Agencies',
    icon: 'far fa-flag',
    path: '/admin/forms/agencies'
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
    position: 'fixed',
    size: 'compact'
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
  auth: true,
  ...authMenuConfig,
  component: Home
}

export default config;