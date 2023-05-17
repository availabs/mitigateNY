import React from 'react';


const Home = () => 
  <div className='h-full flex-1 flex flex-col text-gray-900 bg-gray-100'>
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className="text-6xl font-bold">Home Page</div>
        <div className="text-xl">Put something here</div>
        <div className="text-xl"></div>
      </div>
  </div>

const config = {
  name:'Title',
  path: "/",
  exact: true,
  auth: false,
  mainNav: false,
  sideNav: {
    size: 'none'
  },
  topNav: {
    position: 'fixed'
  },
  component: Home
}

export default config;