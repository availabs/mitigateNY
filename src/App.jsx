import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Blog from "~/pages/blog"
import Site from '~/pages/site'
import Docs from '~/pages/docs'


const routes = [
  {
    path: "about",
    element: <div>About</div>,
  },
  Docs,
  Blog,
  Site
];

const App = (props) => {
  return (
    <div className=''>
      <RouterProvider router={createBrowserRouter(routes)} />
    </div>
  );
}

export default App;
