import CMS from './pages/cms'

import DataManager from "~/pages/DataManager"

import Admin, { authMenuConfig } from "./pages/admin"
import Playground from './pages/admin/playground'

// import Test from "./pages/Test"
// import NymtcSurveyCrosswalk from "./pages/nymtcSurveyCrosswalk"

const Routes = [
  Admin,
  ...DataManager('/cenrep','hazmit_dama',false,{},authMenuConfig),
  Playground,
  CMS,
]

const site = {
	title: "Title",
	Routes
}

export default site