import React from 'react'
import ReactDOM from 'react-dom/client'
import { authProvider } from "~/modules/ams/src" //"./modules/ams/src"
import { AUTH_HOST, PROJECT_NAME, CLIENT_HOST }  from './config'
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

export const falcor = falcorGraph('https://graph.availabs.org')
const AuthEnabledApp = authProvider(App, { AUTH_HOST, PROJECT_NAME, CLIENT_HOST });

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

