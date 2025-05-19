import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import get from "lodash/get";
import SourcesLayout from "./layout";
import { useParams } from "react-router";
import {authMenuConfig} from '../index'

const SourceThumb = ({ source }) => {
 
  //const Lexical = dmsDataTypes.lexical.ViewComp;

  return (
    <div className="w-full p-4 bg-white hover:bg-blue-50 block border shadow flex">
      <div>
        <Link to={`${source.path}`} className="text-xl font-medium w-full block">
          <span>{source.name}</span>
        </Link>
      {/*  <div>
          {(get(source, "categories", []) || [])
            .map(cat => (typeof cat === 'string' ? [cat] : cat).map((s, i) => (
              <Link key={i} to={`${baseUrl}/cat/${i > 0 ? cat[i - 1] + "/" : ""}${s}`}
                    className="text-xs p-1 px-2 bg-blue-200 text-blue-600 mr-2">{s}</Link>
            )))
          }
        </div>*/}
        <Link to={`${source.path}`} className="py-2 block">
          {source.description}
        </Link>
      </div>

      
    </div>
  );
};


const SourcesList = () => {
  const [layerSearch, setLayerSearch] = useState("");
  const { cat1, cat2, ...rest } = useParams();
  //const {pgEnv, baseUrl, falcor, falcorCache, user} = React.useContext(DamaContext);
  const [sort, setSort] = useState('asc');
  const sourceDataCat = 'Unknown'
  //const isListAll = window.location.pathname.replace(`${baseUrl}/`, '')?.split('/')?.[0] === 'listall';

  
  const sources = [{
    name:'Actions',
    categories: [],
    description: 'Hazard Mitigation Actions',
    path: '/actions-test/'

  }]

 
  const actionButtonClassName = 'bg-transparent hover:bg-blue-100 rounded-sm p-2 ml-0.5 border-2';
  return (

    <SourcesLayout >
      <div className="py-4 flex flex-rows items-center">
        <input
            className="w-full text-lg p-2 border border-gray-300 "
            placeholder="Search datasources"
            value={layerSearch}
            onChange={(e) => setLayerSearch(e.target.value)}
        />

       {/* <button
            className={actionButtonClassName}
            title={'Toggle Sort'}
            onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
        >
          <i className={`fa-solid ${sort === 'asc' ? `fa-arrow-down-z-a` : `fa-arrow-down-a-z`} text-xl text-blue-400`}/>
        </button>*/}


      </div>
      <div className={'flex flex-row'}>
        
        <div className={'flex flex-1 flex-col space-y-1.5 ml-1.5 max-h-[80dvh] overflow-auto scrollbar-sm'}>
          {
            sources
                .filter(source => {
                  let searchTerm = (source.name + " " + (source?.categories || [])
                      .reduce((out,cat) => {
                        out += Array.isArray(cat) ? cat.join(' ') : typeof cat === 'string' ? cat : '';
                        return out
                      },'')) //get(source, "categories[0]", []).join(" "));
                  return !layerSearch.length > 2 || searchTerm.toLowerCase().includes(layerSearch.toLowerCase());
                })
                .sort((a,b) => {
                  const m = sort === 'asc' ? 1 : -1;
                  return m * a.name?.localeCompare(b.name)
                })
                .map((s, i) => <SourceThumb key={i} source={s} />)
          }
        </div>
      </div>
    </SourcesLayout>

  );
};

const managedDataConfig = {
  name:'Managed Data',
  path: "/forms2",
  exact: true,
  auth: true,
  ...authMenuConfig,
  component: SourcesList
}

console.log('what is here', managedDataConfig, authMenuConfig)

export default managedDataConfig