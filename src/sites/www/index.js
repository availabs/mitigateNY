import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import CMS from './pages/cms'


import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes from "~/pages/HazmitDataTypes"

import Admin, { authMenuConfig } from "./pages/admin"
import Playground from './pages/admin/playground'
import Drafts from './pages/admin/drafts'
import Templates from './pages/admin/templates'
import Interactive from "./pages/interactive/index.jsx";
import FormsActions from './pages/admin/forms/actions'




const Routes = [
  // -- Admin Routes -- //
  Admin,
  ...DamaRoutes({
    baseUrl:'/cenrep',
    defaultPgEnv : "hazmit_dama",
    navSettings: authMenuConfig,
    dataTypes: hazmitDataTypes,
    useFalcor,
    useAuth
  }),
  Playground,
  Drafts,
  Templates,
  Interactive,
  // -- Managed Data Routes -- //
  FormsActions,
  // -- Front End Routes -- //
  CMS
]

const site = {
	Routes
}

export default site