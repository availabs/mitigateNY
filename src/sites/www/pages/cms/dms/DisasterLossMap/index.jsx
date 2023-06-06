import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { AvlMap } from '~/modules/avl-map/src';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySearch/index.jsx";
import DisasterSearch from "../DisasterSearch/index.jsx";
import { Loading } from "~/utils/loading.jsx";
import {metaData} from "./config.js";
import {RenderTypeSelector} from "./components/RenderTypeSelector.jsx";
import config from '~/config.json';
import {ChoroplethCountyFactory} from "./components/choroplethCountyLayer.jsx";
import _ from "lodash";
import {Link} from "react-router-dom";
import {formatDate} from "../../../../../../utils/macros.jsx";

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 229;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 599);
    const [disasterNumber, setDisasterNumber] = useState(cachedData?.disasterNumber);
    const [countyView, setCountyView] = useState();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');
    const [type, setType] = useState(cachedData?.type || 'total_losses');
    const [typeId, setTypeId] = useState(cachedData?.typeId);

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];
    const attributionPath = view_id => ['dama', pgEnv, 'views', 'byId', view_id, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']];


    useEffect( () => {
        async function getData(){
            if(!geoid || !disasterNumber){
                !geoid && setStatus('Please Select a Geography');
                !disasterNumber && setStatus('Please Select a Disaster');
            }else{
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const countyView = deps.find(dep => dep.type === "tl_county");
                setCountyView(countyView.view_id);

                const typeId = deps.find(dep => dep.type === metaData[type]?.type);

                if(!typeId) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }
                setTypeId(typeId.view_id);

                await falcor.get(
                    attributionPath(typeId.view_id)
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, disasterNumber, type]);

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', typeId, 'attributes'], {});

    const map_layers = useMemo(() => [ ChoroplethCountyFactory() ], []);
    const layerProps =
            {
                ccl: {disaster_number: disasterNumber,
                    geoid,
                    ealViewId,
                    view: typeId,
                    views: [{...metaData[type], id: typeId}],
                    pgEnv,
                    loading, setLoading,
                    change: e => onChange(JSON.stringify({...e, disasterNumber, ealViewId, geoid, status, type, typeId, attributionData}))
                }
            };

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable
                        source_id={ealSourceId}
                        view_id={ealViewId}
                        onChange={setEalViewId}
                        className={'flex-row-reverse'}
                    />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                    <DisasterSearch
                        view_id={ealViewId}
                        value={disasterNumber}
                        geoid={geoid}
                        onChange={setDisasterNumber}
                        className={'flex-row-reverse'}
                    />
                    <RenderTypeSelector
                        label={'Select Type:'}
                        types={Object.keys(metaData)}
                        type={type}
                        setType={setType}
                    />
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <React.Fragment>
                                <div className={`flex-none h-[500px] w-full p-1`}>
                                    <AvlMap
                                        mapbox_logo={false}
                                        navigationControl={false}
                                        accessToken={config.MAPBOX_TOKEN}
                                        falcor={falcor}
                                        mapOptions={{
                                            // styles: [
                                            //   // { name: "Light", style: "mapbox://styles/am3081/ckdfzeg1k0yed1ileckpfnllj" }
                                            // ]
                                        }}
                                        layers={map_layers}
                                        layerProps={layerProps}
                                        CustomSidebar={() => <div />}
                                    />
                                </div>
                                <div className={'flex flex-row text-xs text-gray-700 p-1'}>
                                    <label>Attribution:</label>
                                    <div className={'flex flex-col pl-1'}>
                                        <Link to={`/${baseUrl}/source/${ attributionData?.source_id }/versions/${attributionData?.view_id}`}>
                                            { attributionData?.version } ({formatDate(attributionData?._modified_timestamp?.value)})
                                        </Link>
                                    </div>
                                </div>
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
    if(!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] : 
        JSON.parse(value)
    const baseUrl = '/';
    const attributionData = data?.attributionData;

    return (
        <div className='relative w-full p-6'>
            {
                data?.status ?
                    <div className={'p-5 text-center'}>{data?.status}</div> :
                    <div className='h-80vh flex-1 flex flex-col'>
                        <img alt='Choroplath Map' src={get(data, ['img'])} />
                        <div className={'flex flex-row text-xs text-gray-700 p-1'}>
                            <label>Attribution:</label>
                            <div className={'flex flex-col pl-1'}>
                                <Link to={`/${baseUrl}/source/${ attributionData?.source_id }/versions/${attributionData?.view_id}`}>
                                    { attributionData?.version } ({formatDate(attributionData?._modified_timestamp?.value)})
                                </Link>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )           
}


export default {
    "name": 'Map: FEMA Disaster Loss',
    "type": 'Map',
    "EditComp": Edit,
    "ViewComp": View
}