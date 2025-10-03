import React, {useEffect, useLayoutEffect, useState} from 'react';
import { useLocation } from "react-router";
import cloneDeep from 'lodash/cloneDeep'
import Layout from './avail-layout'
import { useAuth } from '../modules/dms/src';

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

  const { user } = useAuth();
  const Child = Element || Comp

  return (
        <Wrapper>
            <Layout {...props} user={user}>
                <Child />
            </Layout>
        </Wrapper>
    // </Provider>
  )
}

export default function  DefaultLayoutWrapper ( routes, layout=Layout ) {
  const menus = routes.filter(r => r.mainNav)
  return routes.map(route => {
    let out = cloneDeep(route)
    out.element = <LayoutWrapper {...out} Layout={layout} menus={menus} />
    return out
  })
}
