import React, {useEffect} from 'react'
import { useParams } from "react-router-dom";
// import { checkAuth } from "~/utils/session.server";

import { 
  DmsManager, 
  dmsDataLoader,
  dmsDataEditor, 
  registerDataType 
} from '~/modules/dms'


import DmsDraft from '~/modules/dms-custom/draft'
import blogConfig from './blog.config.jsx'

registerDataType('richtext', DmsDraft)


async function loader ({ request, params }) {
  let data = await dmsDataLoader(blogConfig, params['*'])
  // console.log('loader data', params['*'], data)
  return { 
    data,
    user: {id: 5, authLevel: 5}
  }
}

async function action ({ request, params }) {
  const form = await request.formData();
  // const pathname = new URL(request.url).pathname.slice(1);
  return dmsDataEditor(blogConfig, JSON.parse(form.get("data")), params['*'])
};

function DMS() {
    const params = useParams();
    //console.log('render dms', params)
    return (
      <div>
        Params: {JSON.stringify(params)}
        <DmsManager 
          path={params['*'] || ''}
          config={Object.freeze(blogConfig)}
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

const config = {
  path: 'blog/*',
  element: <DMS />,
  loader: loader,
  action: action,
  errorElement: <ErrorBoundary />
}

export default config