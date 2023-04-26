import React, {useEffect} from 'react'
import { useParams, ScrollRestoration, useLocation } from "react-router-dom";

import { 
  DmsManager, 
  dmsDataLoader,
  dmsDataEditor, 
} from '~/modules/dms'


export default function dmsPageFactory (dmsConfig,dmsPath='/')  {

  async function loader ({ request, params }) {
    let data = await dmsDataLoader(dmsConfig, `/${params['*'] || ''}`)
    return { 
      data,
      user: {id: 5, authLevel: 5}
    }
  }

  async function action ({ request, params }) {
    const form = await request.formData();
    return dmsDataEditor(dmsConfig, 
      JSON.parse(form.get("data")), 
      form.get("requestType"), 
      params['*']
    )
  };

  function DMS() {
      const params = useParams();
      // const { pathname } = useLocation();

      // useEffect(() => {
      //   console.log('testing')
      //   window.scrollTo(0, 0);
      // }, [pathname]);
      return (
        <div>
          <DmsManager 
            path={ `/${params['*'] || ''}` }
            config={dmsConfig}
          />
        </div>
      )
  }

  function ErrorBoundary({ error }) {
    return (
      <div>
        <h1>DMS Error ErrorBoundary</h1>
        <p>{error?.message}</p>
        <p>The stack trace is:</p>
        <pre>{error?.stack}</pre>
      </div>
    );
  }

  return {
    path: `${dmsPath}*`,
    element: <DMS />,
    loader: loader,
    action: action
  }
}

