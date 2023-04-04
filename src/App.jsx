import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Blog from "~/pages/blog"
import Site from '~/pages/site'


const routes = [
  {
    path: "about",
    element: <div>About</div>,
  },
  Blog,
  Site
];

const App = (props) => {
  return (
    <div className='max-w-6xl mx-auto border p-4'>
      <RouterProvider router={createBrowserRouter(routes)} />
    </div>
  );
}

export default App;
