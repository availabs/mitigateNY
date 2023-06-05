import Admin, { authMenuConfig } from "./pages/admin"
import CMS from './pages/cms'
import DataManager from "~/pages/DataManager"
// import Test from "./pages/Test"
// import NymtcSurveyCrosswalk from "./pages/nymtcSurveyCrosswalk"

const Routes = [
  Admin,
  ...DataManager('/cenrep','hazmit_dama',false,{},authMenuConfig),
  CMS,
]

const site = {
	title: "Title",
	Routes
}

export default site