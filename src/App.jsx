import React from 'react';
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

export const checkAuth = (props,navigate) => {
  //const isAuthenticating = props?.user?.isAuthenticating
  
  //------------------------------------------
  // TODO : if user is logged in 
  // and refreshes authed page
  // isAuthenticating = false and Authed = false 
  // so user is sent to login
  // while token check happens in background
  // then user is send back to authed page
  // by /auth/login redirect using state:from
  // can we switch to isAuthenticating is true
  //------------------------------------------

  const authLevel = props.auth ? 0 : (props?.authLevel || -1); 
  const sendToLogin = authLevel > -1 && !get(props, ["user", "authed"], false)
  const sendToHome = (get(props , ["user", "authLevel"], -1) < authLevel);
  //console.log('lw login:', sendToLogin, 'home:',sendToHome, props.path)
  
  //----------------------------------------
  // if page requires auth
  // && user isn't logged in
  // send to login 
  //----------------------------------------
  if( sendToLogin ) {
    //console.log('navigate to login', nav)
    navigate("/auth/login", {state:{ from: props.path }})
    // return <Navigate 
    //   to={ "/auth/login" } 
    //   state={{ from: props.path }}
    // />
  } 
  //----------------------------------------
  // if page requires auth level
  // && user is below that
  // send to home
  //----------------------------------------
  else if (sendToHome) {
    navigate('/')
    //return <Navigate to='/' />
  }

  return false
}

const LayoutWrapper = withAuth(({ 
  element: Element, 
  component: Comp, 
  Layout=({children}) => <>{children}</>, 
  ...props
}) => {
  const Child = Element || Comp // support old react router routes
  const isAuthenticating = props?.user?.isAuthenticating
  const navigate = useNavigate()
  React.useEffect(() => {
    checkAuth(props,navigate)
  },[])
  
  // -------------------------------------
  // Not sure if we want to restore this 
  // -------------------------------------
  // if(authLevel > -1 && isAuthenticating) {
  //   return <Layout {...props}>Loading</Layout>
  // }
 
  return (
    <Layout {...props}>
      <Child {...props}/>
    </Layout>
  )
})

function  DefaultLayoutWrapper ( routes, layout ) {
  return routes.map(route => {
    route.element = <LayoutWrapper {...route} Layout={layout} />
    return route
  })
}


const WrappedRoutes = DefaultLayoutWrapper(routes, AvailLayout)

const App = (props) => {
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
