import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {falcor} from "~/modules/avl-falcor"
import get from "lodash/get";
import ComponentRegistry from '~/component_registry';
import isEqual from "lodash/isEqual.js";
const Home = () => {
  const {id} = useParams();
  if(!id) return null;
  const [value, setValue] = useState();

  const attributes = ['data'];
  const dataRoute = ['dms', 'data', 'byId', id];

  useEffect(() => {
    (async function() {
      const res = await falcor.get([...dataRoute, attributes]);
      setValue(get(res, ['json', ...dataRoute, 'data', 'element'], {}))
    })()
  }, [id]);

  let DataComp = (ComponentRegistry[get(value, "element-type")])?.EditComp;
  if(!DataComp) return null;

  return (
      <div className='h-full flex-1 flex flex-col text-gray-900 bg-slate-100'>
        <DataComp
            value={value?.['element-data'] || ''}
            onChange={d => d}
        />
      </div>
  )
}


export const authMenuConfig = {
  sideNav: {
    size: 'none',
    color: 'white',
  },
  topNav: {
    position: 'fixed',
    size: 'compact'
  },
}

const config = {
  name:'Title',
  path: "/interact/:id?",
  exact: true,
  // auth: true,
  ...authMenuConfig,
  component: Home
}

export default config;