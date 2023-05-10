import React, {useMemo} from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate
} from "react-router-dom";

// import { Messages } from '~/modules/avl-components/src'
import AvailLayout from '~/layout/avail-layout'
import { withAuth, Messages } from '~/modules/ams/src'
import get from 'lodash/get'

import routes from '~/routes'
import Layout from '~/layout/avail-layout'
import LayoutWrapper from '~/layout/LayoutWrapper'


const App = (props) => {
  
  const WrappedRoutes =  useMemo(() => {
    return LayoutWrapper(routes, Layout)
  }, [])
  //console.log('Wrapped', WrappedRoutes)


  return (
    <>
      <RouterProvider 
        router={createBrowserRouter(WrappedRoutes)} 
      />
      <Messages />
    </>
  )

  
}

export default App;
