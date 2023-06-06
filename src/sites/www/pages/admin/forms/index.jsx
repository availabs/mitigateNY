import authMenuConfig from '../'

const Home = () => 
  <div className='h-full flex-1 flex flex-col text-gray-900 bg-slate-100'>
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className="text-6xl font-bold">DHSES Data</div>
        <div className="text-xl">One two</div>
        <div className="text-xl">in progress</div>
      </div>
  </div>

const config = {
  name:'Forms',
  path: "/admin/forms/:formType",
  auth: true,
  ...authMenuConfig,
  component: Home
}

export default config;