import { useFalcor } from '~/modules/avl-falcor';
import { useAuth } from "~/modules/ams/src";

import CMS from './pages/cms'


import DamaRoutes from "~/pages/DataManager"
import hazmitDataTypes from "~/pages/HazmitDataTypes"

// import Admin, { authMenuConfig } from "./pages/admin"
// import Playground from './pages/admin/playground'
// import Drafts from './pages/admin/drafts'
// import Templates from './pages/admin/templates'
import Interactive from "./pages/interactive/index.jsx";

// import Docs from './pages/admin/docs'

// import ManagedData from './pages/admin/managed_data/index.jsx'

// import Forms from './pages/forms'
// import FormsActions from './pages/admin/forms/formats/actionsIndex.jsx';
// import FormsCapabilities from './pages/admin/forms/formats/capabilitiesIndex.jsx';
// import FormsMeasures from './pages/admin/forms/formats/measures.jsx';
// import FormsRVMatrix from './pages/admin/forms/formats/rv_matrix.jsx';
// import FormPolicy from './pages/admin/forms/formats/policy.jsx';



const Routes = [
  // -- Admin Routes -- //
  //Admin,
  //ManagedData,
  ...DamaRoutes({
    baseUrl:'/cenrep',
    defaultPgEnv : "hazmit_dama",
    navSettings: authMenuConfig,
    dataTypes: hazmitDataTypes,
    useFalcor,
    useAuth
  }),
  // Playground,
  // Drafts,
  // Docs,
  // Templates,
  Interactive,
  // -- Managed Data Routes -- //
  // Forms,
  // FormsActions,
  // FormsCapabilities,
  // FormsMeasures,
  // FormsRVMatrix,
  // FormPolicy,
  // -- Front End Routes -- //
  // CMS
]

//console.log('export routes', Routes, ManagedData)

const site = {
	Routes
}

export default site