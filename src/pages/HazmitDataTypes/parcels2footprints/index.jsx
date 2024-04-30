import React from 'react';
import { DamaContext } from "~/pages/DataManager/store";
import { useNavigate } from 'react-router-dom'
import { SourceAttributes, ViewAttributes, getAttributes } from "~/pages/DataManager/Source/attributes";
import get from 'lodash/get'

import { DAMA_HOST } from "~/config";

function Create ({
  source = {},
  user = {},
  dataType = "gis_dataset",
  databaseColumnNames = null,
}) {

  // console.log('tippecanoeOptions', tippecanoeOptions)
    const navigate = useNavigate()
    const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);
    const { name: damaSourceName, source_id: damaSourceId, type } = source;
  
    const [createState, setCreateState] = React.useState({
        damaSourceId,
        damaSourceName,
        sourceType: dataType,
        footprintViewId: null,
        parcelViewId: null,
        footprintSourceId: null,
        parcelSourceId:null
    })

    const submit = () => {
        console.log('submit task for procesing')
        const runSubmit =  async () => {
            const publishData = {
              source_id: createState.damaSourceId || null,
              source_values: {
                name: createState.damaSourceName,
                type: createState.sourceType || 'gis_dataset',
                categories: [["Enhanced Footprints"]]
              },
              user_id: user.id,
              footprint_view_id: createState.footprintViewId,
              parcel_view_id: createState.parcelViewId
              
            };

            console.log('publish', publishData)

            const res = await fetch(
                `${DAMA_HOST}/dama-admin/${pgEnv}/parcels2footprints`, 
                {
                  method: "POST",
                  body: JSON.stringify(publishData),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
            );
            
            const publishFinalEvent = await res.json();
            navigate(`${baseUrl}/source/${publishFinalEvent.source_id}/uploads/${publishFinalEvent.etl_context_id}`)
        }

        runSubmit()
    }


    // update source name
    React.useEffect(() => {
        setCreateState({...createState, damaSourceName })
    }, [damaSourceName]);

    //----------------------
    //  Select Sources for parcels and footprints
    //  Filtered by Categories "Parcels" and "Buildings" should change to footprints
    //----------------------
    React.useEffect(() => {
        async function fetchData() {
          const lengthPath = ["dama", pgEnv, "sources", "length"];
          const resp = await falcor.get(lengthPath);
          // console.log(resp)
          await falcor.get([
            "dama", pgEnv, "sources", "byIndex",
            { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
            "attributes", Object.values(SourceAttributes)
          ]);
        }

        fetchData();
    }, [falcor, pgEnv]);

    const parcelSources = React.useMemo(() => {
        let val =  Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
            .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
        return val.filter(d => d?.categories?.map(d => d[0])?.includes('Parcels')) || []
    }, [falcorCache, pgEnv]);

    const footprintSources = React.useMemo(() => {
        let val =  Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
            .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
        return val.filter(d => d?.categories?.map(d => d[0])?.includes('Buildings')) || []
    }, [falcorCache, pgEnv]);


    //----------------------
    //  Select views for parcels and footprints
    //  Filtered by sourceIds
    //----------------------
    React.useEffect(() => {
        async function fetchData() {
          const lengthPath = ["dama", pgEnv, "sources", "byId", createState.parcelSourceId, "views", "length"];
          const resp = await falcor.get(lengthPath);
          let data = await falcor.get(
            [
              "dama", pgEnv, "sources", "byId", createState.parcelSourceId, "views", "byIndex",
              { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
              "attributes", Object.values(ViewAttributes)
            ]
          );
         
          return data;
        }
        if(createState.parcelSourceId){
            fetchData();
        }
    }, [createState.parcelSourceId, falcor, pgEnv]);

    React.useEffect(() => {
        async function fetchData() {
          const lengthPath = ["dama", pgEnv, "sources", "byId", createState.footprintSourceId, "views", "length"];
          const resp = await falcor.get(lengthPath);
          let data = await falcor.get(
            [
              "dama", pgEnv, "sources", "byId", createState.footprintSourceId, "views", "byIndex",
              { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
              "attributes", Object.values(ViewAttributes)
            ]
          );
         
          return data;
        }
        if(createState.footprintSourceId){
            fetchData();
        }
    }, [createState.footprintSourceId, falcor, pgEnv]);

    const parcelViews = React.useMemo(() => {
        return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.parcelSourceId, "views", "byIndex"], {}))
            .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
    }, [falcorCache, createState.parcelSourceId, pgEnv]);

    const footprintViews = React.useMemo(() => {
        return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.footprintSourceId, "views", "byIndex"], {}))
            .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
    }, [falcorCache, createState.footprintSourceId, pgEnv]);

    return (
        <div className="group">
            <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                <dt className="text-sm font-medium text-gray-500 py-5">
                    Select Parcel Source
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="pt-3 pr-8">
                    <select 
                        value={createState.parcelSourceId} 
                        onChange={e => setCreateState({...createState, parcelSourceId: e.target.value, parcelViewId: null})} 
                        className='px-2 py-4 w-full bg-white shadow'
                    >
                        <option value={null}>Select Parcel Source</option>
                        {(parcelSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                    </select>
                    </div>
                </dd>
            </div>
            {createState.parcelSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Parcel Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select 
                                value={createState.parcelViewId} 
                                onChange={e => setCreateState({...createState, parcelViewId: e.target.value})} 
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Parcel Source</option>
                                {(parcelViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.parcelViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Foorprint Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select 
                                value={createState.footprintSourceId} 
                                onChange={e => setCreateState({...createState, footprintSourceId: e.target.value, footprintViewId: null})} 
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Parcel Source</option>
                                {(footprintSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.footprintSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Footprint Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select 
                                value={createState.footprintViewId} 
                                onChange={e => setCreateState({...createState, footprintViewId: e.target.value})} 
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Parcel Source</option>
                                {(footprintViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.footprintViewId && (
                <div className='w-full flex p-4'>
                    <div className='flex-1' />
                    <div>
                        <button
                          className="rounded-md p-2 border-2 border-blue-300 bg-blue-500 shadow hover:shadow-lg text-slate-100 hover:bg-blue-700"
                          onClick={submit}
                        >
                            Process
                        </button> 
                    </div>
                </div>
            )}
        </div>
    )
}




const Parcels2Footprints = {
    
    stats: {
        name: 'Stats',
        path: '/stats',
        component: () => <div> No stats </div>
    },
    sourceCreate: {
        name: 'Create',
        component: Create
    }

}

export default Parcels2Footprints
