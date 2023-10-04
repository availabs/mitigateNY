import React, {Fragment, useState, useEffect, useMemo} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink, Link } from "react-router-dom";
import {useFalcor} from '~/modules/avl-falcor';
import Selector from './Selector'
import get from 'lodash/get'
import {getAttributes} from '~/pages/DataManager/Source/attributes'

const pgEnv = 'hazmit_dama'

export default function DataControls ({item, dataItems,dataControls, setDataControls, open, setOpen}) {
  
  const updateDataControls = (k,v) => {
    setDataControls({...dataControls, [k]: v})
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20 " onClose={()=> {setOpen(false); console.log('onclose');}}>
        <div className="fixed inset-x-0 bottom-0 top-12  overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 top-12 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Data Controls
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <i className="h-6 w-6 text-lg fa fa-close" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <span className='text-sm text-gray-500 p-1'>Select Template Source:</span>
                      <SourcesSelect 
                        value={dataControls.source}
                        onChange={(v) => {
                          console.log('SourcesSelect onChange', v)
                          updateDataControls('source', v)
                        }} 
                      />
                      {dataControls?.source?.source_id ? 
                        <ViewsSelect
                          source_id={dataControls?.source?.source_id}
                          value={dataControls.view}
                          onChange={(v) => {
                            console.log('ViewsSelect onChange', v)
                            updateDataControls('view', v)
                          }} 
                        /> : ''
                      }
                      {dataControls?.source?.source_id &&  
                       dataControls?.view?.view_id? 
                        <div>
                          <ViewInfo
                            source={dataControls.source}
                            view={dataControls.view}
                          />
                          <PathControl />
                          <ComponentListControls sections={item.sections}/>
                        </div> 
                        : ''
                      }

                      {/*<div>
                        <pre>
                         {JSON.stringify(dataControls, null,3)}
                        </pre>
                      </div>*/}
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const SectionThumb =({section}) => {

  let data = JSON.parse(section?.element?.['element-data']) || {}

  return (
    <div className='p-4 border rounded mb-1'>
      <div>Title: {section.title}</div>
      <div>{section?.element?.['element-type']}</div>
      <div>
        {Object.keys(data)
          //.filter()
          .map(k => {
          return (
            <div>
              {k}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ComponentListControls = ({sections}) => {
  console.log('ComponentListControls', sections)
  return (
    <div>
      {sections.map(s=> <SectionThumb key={s.id} section={s} />)}
    </div>
  )
}

const PathControl = () => {
  return <div>Path...</div>
}

const SourcesSelect = ({value, onChange}) => {
  
  const { falcor, falcorCache } = useFalcor();
  
  useEffect(() => {
    async function fetchData() {
      const lengthPath = ["dama", pgEnv, "sources", "length"];
      const resp = await falcor.get(lengthPath);
      console.log('length', get(resp.json, lengthPath, 0) - 1)
      const dataResp = await falcor.get([
        "dama", pgEnv, "sources", "byIndex",
        { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
        "attributes", ['source_id', 'name', 'metadata']
      ]);
      console.log('dataResp', dataResp)
    }

    fetchData();
  }, [falcor, pgEnv]);

  const sources = useMemo(() => {
    //console.log('set sources', falcorCache)
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
  }, [falcorCache, pgEnv]);

  //console.log('sources select', sources)
  return (
     <Selector 
      options={['',...sources]}
      selected={value}
      onChange={(v)=> onChange(v) }
    />
  );
};


const ViewsSelect = ({source_id, value, onChange}) => {
  
  const { falcor, falcorCache } = useFalcor();
  
  useEffect(() => {
    async function fetchData() {
      const lengthPath = ["dama", pgEnv, "sources", "byId", source_id, "views", "length"];;
      const resp = await falcor.get(lengthPath);
      // console.log('length', get(resp.json, lengthPath, 0) - 1)
      const dataResp = await falcor.get([
          "dama", pgEnv, "sources", "byId", source_id, "views", "byIndex",
          { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
          "attributes", ['view_id', 'version']
        ]);
      //console.log('dataResp', dataResp)
    }

    fetchData();
  }, [falcor, pgEnv]);

  const views = useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
  }, [falcorCache, source_id, pgEnv]);


  useEffect(() => {
    if(!value && views?.[0]?.view_id) {
      onChange(views?.[0])
    }
  },[views])
  


  // console.log('sources select', views)
  return (
     <Selector 
      options={['',...views]}
      selected={value}
      nameAccessor={d => d?.version }
      onChange={(v)=> onChange(v) }
    />
  );
};

const ViewInfo = ({source,view}) => {
  
  const { falcor, falcorCache } = useFalcor();
  
  React.useEffect(() => {
    if(view.view_id){
      falcor.get(["dama", pgEnv, "viewsbyId", view.view_id, "data", "length"])
    } 
  }, [pgEnv,  view.view_id]);

  const dataLength = React.useMemo(() => {
    return get(
      falcorCache,
      ["dama", pgEnv, "viewsbyId", view.view_id, "data", "length"],
      "No Length"
    );
  }, [pgEnv, view.view_id, falcorCache]);

  const attributes = React.useMemo(() => {
    
    let md = get(source, ["metadata", "columns"], get(source, "metadata", []));
    if (!Array.isArray(md)) {
      md = [];
    }

    return md
      
  }, [source]);
  


  // console.log('sources select', views)
  return (
     <div className='flex flex-col'>
      <div>View Info</div>
      <div>Rows: {dataLength} </div>
      <div>Attributes : {attributes?.length || 0}</div>
     </div>
  );
};


