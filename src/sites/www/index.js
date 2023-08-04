import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import CMS from './pages/cms'

import DamaRoutes from "~/pages/DataManager"

import Admin, { authMenuConfig } from "./pages/admin"
import Playground from './pages/admin/playground'
import Forms from './pages/admin/forms/index'

// import Test from "./pages/Test"
// import NymtcSurveyCrosswalk from "./pages/nymtcSurveyCrosswalk"

//console.log('test 123', Forms)

const Routes = [
  // -- Admin Routes -- //
  Admin,
  ...DamaRoutes({
    baseUrl:'/cenrep',
    defaultPgEnv : "hazmit_dama",
    auth : false,
    components : {},
    navSettigs : {},
    useFalcor,
    useAuth
  }),
  Playground,
  Forms,
  // -- Front End Routes -- //
  CMS,
]

const site = {
	Routes
}

export default site