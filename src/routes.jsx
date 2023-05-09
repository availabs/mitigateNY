import Blog from "~/pages/blog"
import Site from '~/pages/site'
import Docs from '~/pages/docs'
import Auth from '~/pages/auth'

const DataManager = [
    // Source List
    {
      name: "Data Sources",
      path: `datasources`,
      auth: false,
      mainNav: false,
      title: '',
      sideNav: {
        color: "dark",
        size: "micro"
      },
      component: () => <div>Datasources</div>
    },
    {
      name: "Data Sources",
      path: `datasources/cat/:cat1`,
      auth: false,
      mainNav: false,
      title: '',
      sideNav: {
        color: "dark",
        size: "micro"
      },
      component: () => <div>Datasources Cat</div>
    }
]

const routes = [
  {
    path: "/",
    element: () => <div className='border-2 h-full min-h-screen mb-12 border-pink-500'>Home</div>,
    sideNav: {
      size: 'micro' // ['none', 'micro', 'mini', 'compact', 'full']
    },
    topNav: {
      size: 'compact', // ['none', 'compact']
      menu: 'right', // ['left', right]
      position: 'fixed' // ['fixed', 'block']
    } 
  },
  {
    path: "/authed",
    element: () => <div className='border-2 h-full min-h-screen mb-12 border-pink-500'>authed</div>,
    sideNav: {
      size: 'micro' // ['none', 'micro', 'mini', 'compact', 'full']
    },
    topNav: {
      size: 'compact', // ['none', 'compact']
      menu: 'right', // ['left', right]
      position: 'fixed' // ['fixed', 'block']
    },
    authLevel: 5
  },
  Docs,
  Site,
  ...DataManager,
  Auth
]

export default routes