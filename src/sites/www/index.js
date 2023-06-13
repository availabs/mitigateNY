import CMS from './pages/cms'

import DataManager from "~/pages/DataManager"

import Admin, { authMenuConfig } from "./pages/admin"
import Playground from './pages/admin/playground'
import Forms from './pages/admin/forms/index'

// import Test from "./pages/Test"
// import NymtcSurveyCrosswalk from "./pages/nymtcSurveyCrosswalk"

//console.log('test 123', Forms)

const Routes = [
  // -- Admin Routes -- //
  Admin,
  ...DataManager('/cenrep','hazmit_dama',false,{},authMenuConfig),
  Playground,
  Forms,
  // -- Front End Routes -- //
  CMS,
]

const site = {
	Routes
}

export default site