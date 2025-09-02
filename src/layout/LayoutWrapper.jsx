import React, {useEffect, useLayoutEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router";
import cloneDeep from 'lodash/cloneDeep'
import { Provider } from "react-redux";
import Layout from './avail-layout'
import { configureStore } from "@reduxjs/toolkit";

const Wrapper = ({children}) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);
  return children
}
const LayoutWrapper = ({
  element: Element, 
  component: Comp, 
  Layout=({children}) => <>{children}</>, 
  ...props
}) => {
    const [user, setUser] = useState({})
  const Child = Element || Comp // support old react router routes

  const { getUser } = props;
    useEffect(() => {
        async function load() {
            const user = await getUser();
            setUser(user);
        }

        load()
    }, []);
    // const store = configureStore({
    //     reducer: {}
    // });
  return (
    // <Provider store={store}>
        <Wrapper>
            <Layout {...props} user={user}>
                <Child />
            </Layout>
        </Wrapper>
    // </Provider>
  )
}

export default function  DefaultLayoutWrapper ( routes, layout=Layout, getUser ) {
  const menus = routes.filter(r => r.mainNav)
  return routes.map(route => {
    let out = cloneDeep(route)
    out.element = <LayoutWrapper {...out} Layout={layout} menus={menus} getUser={getUser} />
    return out
  })
}




