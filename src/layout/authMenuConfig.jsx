export const menuItems = [
   {
      "icon": "far fa-home fa-fw",
      "name": "Dashboard",
      "path": "/admin",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "far fa-gauge-simple fa-fw",
      "name": "Plan Status",
      "path": "/admin/plan_status",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "",
      "name": "Pages",
      "path": "",
      "authLevel": "-1",
      "className": "px-6 pt-8 pb-1 uppercase text-xs text-blue-400"
   },
   {
      "icon": "far fa-edit fa-fw",
      "name": "CMS",
      "path": "/edit",
      "authLevel": "-1",
      "className": ""
   },
   {
      "icon": "far fa-flask fa-fw",
      "name": "Playground",
      "path": "/playground/edit",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "far fa-paste fa-fw",
      "name": "Templates",
      "path": "/manage/templates",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "",
      "name": "Cen Rep",
      "path": "",
      "authLevel": "1",
      "className": "px-6 pt-8 pb-1 uppercase text-xs text-blue-400"
   },
   {
      "icon": "far fa-database fa-fw",
      "name": "External Data",
      "path": "/cenrep",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "fad fa-database fa-fw",
      "name": "Managed Data",
      "path": "/forms",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "",
      "name": "Docs",
      "path": "",
      "authLevel": "1",
      "className": "px-6 pt-8 pb-1 uppercase text-xs text-blue-400"
   },
   {
      "icon": "far fa-book fa-fw",
      "name": "Classroom",
      "path": "/docs",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "",
      "name": "Datasets",
      "path": "",
      "authLevel": "1",
      "className": "px-6 pt-8 pb-1 uppercase text-xs text-blue-400"
   },
   {
      "icon": "fad fa-location",
      "name": "Actions",
      "path": "/admin/actions",
      "authLevel": "1",
      "className": ""
   },
   {
      "icon": "fad fa-intersection",
      "name": "DMP",
      "path": "/admin/dmp",
      "authLevel": "1",
      "className": ""
   }
]

export const authMenuConfig = {
  sideNav: {
    size: 'compact',
    color: 'white',
    menuItems
  },
  topNav: {
    position: 'fixed',
    size: 'compact'
  },
}