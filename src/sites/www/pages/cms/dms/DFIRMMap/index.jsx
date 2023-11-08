import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {Link} from "react-router-dom";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import {scaleThreshold} from "d3-scale";
import {EditMap,ViewMap} from "../../components/TemplateMap";
import {Attribution} from "../../components/attribution.jsx";
import {isJson} from "~/utils/macros.jsx";



//const defaultColors = getColorRange(5, "Oranges", false);


async function getData({geoid='36',ealViewId, size="1", height=500}, falcor) {
    //return {}
    
    const sources = [{
      "id": "hazmit_dama_s379_v841_1695834411623",
      "source": {
         "url": "pmtiles://graph.availabs.org/tiles/hazmit_dama_s379_v841_1695834411623.pmtiles",
         "type": "vector"
      },
      "protocol": "pmtiles"
    }]

    const layers = [{
          "id": "s379_v841",
          "type": "fill",
          "paint": {
             "fill-color": "DodgerBlue",
             "fill-opacity": 0.7
          },
          "source": "hazmit_dama_s379_v841_1695834411623",
          "source-layer": "s379_v841"
    }]

    


            
    return {
        ealViewId,
        geoid,
        title: 'Dfirm Map',
        domain: [],
        sources,
        layers,
        attributionData: {},
        size,
        height,
        mapFocus: [-79.761313, 40.477399, -71.777491, 45.01084],
        showLegend:  false
    }
}


const Edit = ({value, onChange, size}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = useMemo(() => {
        return value && isJson(value) ? JSON.parse(value) : {}
    }, [value]);

    //console.log('Edit: value,', size)
   
    const baseUrl = '/';

    const ealSourceId = 343;
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [compData, setCompData] = useState({
        ealViewId: cachedData?.ealViewId || 837,
        geoid: cachedData?.geoid || '36',
        type: cachedData?.type || 'total_losses',
        data: cachedData?.data,
        mapFocus: cachedData.mapFocus,
        title: cachedData?.title,
        height: cachedData?.height || 500
    })

    useEffect(() => {
        // if data is set outside map delete image
        delete compData.img;
        setCompData({...compData, ...cachedData})   
    },[cachedData])

    
    useEffect(() => {
        const load = async () => {
            const {
                geoid, ealViewId, type ,colors, height
            } = compData
            //console.log(geoid, disasterNumber)
            

            setStatus(undefined);
            setLoading(true);
            //console.log('EDIT: get data',geoid,disasterNumber,ealViewId, type)
    
            let data = await getData({
                geoid,
                ealViewId,
                size,
                height
            }, falcor)
            console.log(
                'testing got data', value === JSON.stringify({...cachedData, ...data}), 
                'args', )
            if(value !== JSON.stringify({...cachedData, ...data})) {
                onChange(JSON.stringify({...cachedData, ...data}))
            }
            setLoading(false)
            
        }
        load();
    }, [compData]);

    
    const layerProps = useMemo(() => { 
        console.log('setting Layer Props', cachedData)
        return {
            ccl: {
                ...cachedData,
                change: e => {
                    
                    if(value !== JSON.stringify({...cachedData, ...e})){
                        //console.log('change from map')
                        onChange(JSON.stringify({...cachedData,...e}))
                    }
                }
            }
        }
    },[cachedData])

    //console.log('layerProps', layerProps)

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable
                        source_id={ealSourceId}
                        view_id={compData.ealViewId}
                        onChange={(v) => setCompData({...compData, "ealViewId": v})}
                        className={'flex-row-reverse'}
                    />
                    
                    <ButtonSelector
                        label={'Size:'}
                        types={[{label: 'X Small', value: 200},{label: 'Small', value: 500},{label: 'Medium', value: 700},{label: 'Large', value: 900}]}
                        type={compData.height}
                        setType={v => setCompData({...compData, "height": v})}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <React.Fragment>
                                <div className={`flex-none w-full p-1`} style={{height: `${compData.height}px`}}>
                                    <EditMap
                                        falcor={falcor}
                                        layerProps={layerProps}
                                        legend={{
                                            size,
                                            domain: compData?.domain || [], 
                                            range: compData.colors, 
                                            title: compData.title, 
                                            show: compData.showLegend
                                        }}
                                    />
                                </div>
                                <Attribution baseUrl={baseUrl} attributionData={compData.attributionData} />
                            </React.Fragment>
                }
            </div>
        </div>
    )
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}

const View = ({value}) => {
    if (!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] :
        JSON.parse(value)
    const baseUrl = '/';
    const attributionData = data?.attributionData;
    const layerProps =  {ccl: {...data }}
    console.log('render view', data)

    return (
        <div className='relative w-full p-6'>
            {
               data.img  ?
                    <div className='h-80vh flex-1 flex flex-col'>
                        <img alt='Choroplath Map' src={get(data, ['img'])}/>
                        
                    </div> : 
                    <div className={`flex-none w-full p-1`} style={{height: `${data.height}px`}}>
                        <ViewMap
                            layerProps={layerProps}
                            legend={{
                                size: data.size,
                                domain: data?.domain || [], 
                                range: data.colors, 
                                title: data.title, 
                                show: data.showLegend
                            }}
                        />
                    </div> 
                    
            }
            <Attribution baseUrl={baseUrl} attributionData={attributionData} />
        </div>
    )
}


export default {
    "name": 'Map: Floodplains',
    "type": 'Map',
    "variables": 
    [       
        {
            name: 'geoid',
            default: '36'
        },
        {
            name: 'ealViewId',
            default: 837,
            hidden: true
        },
        
    ],
    getData,

    "EditComp": Edit,
    "ViewComp": View
}