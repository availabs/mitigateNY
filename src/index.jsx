import React from 'react'
import ReactDOM from 'react-dom/client'
// import { authProvider } from "~/modules/ams/src" //"./modules/ams/src"
import { API_HOST, AUTH_HOST, PROJECT_NAME, CLIENT_HOST }  from './config'
import {
  FalcorProvider,
  falcorGraph
} from "~/modules/avl-falcor"

import {
  ThemeContext
} from "~/modules/avl-components/src"

import AVL_THEME from "~/layout/avail-theme"
import App from './App.jsx'
import './index.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

export const falcor = falcorGraph(API_HOST)
const AuthEnabledApp = App //authProvider(App, { AUTH_HOST, PROJECT_NAME, CLIENT_HOST });

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <FalcorProvider falcor={falcor}>
        <ThemeContext.Provider value={AVL_THEME}>
          <AuthEnabledApp />
        </ThemeContext.Provider>
      </FalcorProvider>
    </React.StrictMode>,
  )

