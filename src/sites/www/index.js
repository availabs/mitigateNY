import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import CMS from './pages/cms'


import DamaRoutes from "~/pages/DataManager"

import Admin, { authMenuConfig } from "./pages/admin"
import Playground from './pages/admin/playground'
import FormsActions from './pages/admin/forms/actions'

// import Test from "./pages/Test"
// import NymtcSurveyCrosswalk from "./pages/nymtcSurveyCrosswalk"


const Routes = [
  // -- Admin Routes -- //
  Admin,
  ...DamaRoutes({
    baseUrl:'/cenrep',
    defaultPgEnv : "hazmit_dama",
    navSettings: authMenuConfig,
    useFalcor,
    useAuth
  }),
  Playground,
  // -- Managed Data Routes -- //
  FormsActions,
  // -- Front End Routes -- //
  CMS
]

const site = {
	Routes
}

export default site