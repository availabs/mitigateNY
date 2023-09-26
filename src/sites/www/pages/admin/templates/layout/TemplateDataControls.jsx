import React, {Fragment, useState, useEffect, useMemo} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink, Link } from "react-router-dom";
import {useFalcor} from '~/modules/avl-falcor';
import Selector from './Selector'
import get from 'lodash/get'
import {getAttributes} from '~/pages/DataManager/components/attributes'

export default function DataControls ({items, dataItems,dataControls, setDataControls, open, setOpen}) {
  
  const updateDataControls = (k,v) => {
    setDataControls({...dataControls, [k]: v})
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
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
                        value={dataControls.source_id}
                        onChange={(v) => {
                          console.log('SourcesSelect onChange', v)
                          updateDataControls('source_id', v.source_id)
                        }} 
                      />
                      <div>
                        <pre>
                         {JSON.stringify(dataControls, null,3)}
                        </pre>
                      </div>
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

const SourcesSelect = ({value, onChange}) => {
  
  const { falcor, falcorCache } = useFalcor();
  const pgEnv = 'hazmit_dama'

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
  const pgEnv = 'hazmit_dama'

  useEffect(() => {
    async function fetchData() {
      const lengthPath = ["dama", pgEnv, "sources", "byId", sourceId, "views", "length"];;
      const resp = await falcor.get(lengthPath);
      // console.log('length', get(resp.json, lengthPath, 0) - 1)
      const dataResp = await falcor.get([
          "dama", pgEnv, "sources", "byId", sourceId, "views", "byIndex",
          { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
          "attributes", ['view_id', 'version']
        ]);
      //console.log('dataResp', dataResp)
    }

    fetchData();
  }, [falcor, pgEnv]);

  const views = useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
  }, [falcorCache, pgEnv]);

  // console.log('sources select', views)
  return (
     <Selector 
      options={['',...views]}
      selected={value}
      onChange={(v)=> onChange(v) }
    />
  );
};


