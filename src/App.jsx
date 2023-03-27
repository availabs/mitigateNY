import React from 'react';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Blog from "~/pages/blog"


const routes = [
  {
    path: "/",
    element: (
      <div>
        My App
      </div>    
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  Blog
];

const App = (props) => {
  return (
    <div className='max-w-6xl mx-auto border p-4'>
      <RouterProvider router={createBrowserRouter(routes)} />
    </div>
  );
}

export default App;
