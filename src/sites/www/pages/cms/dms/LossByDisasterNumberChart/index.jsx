import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import { RenderBarChart } from "./components/RenderBarChart.jsx";
import { ProcessDataForMap } from "./utils";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import { Loading } from "~/utils/loading.jsx"
import {HazardSelector} from "../../components/hazardSelector.jsx";

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let data = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(data?.ealViewId || 692);
    const fusionSourceId= 336;
    const [fusionViewId, setFusionViewId] = useState(data?.fusionViewId || 657);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(data?.status);
    const [geoid, setGeoid] = useState(data?.geoid || '36');
    const [hazard, setHazard] = useState(data?.hazard || 'total');
    const [dataPath, setDataPath] = useState([]);

    const dependencyPath = ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", ealViewId];
    const disasterNameAttributes = ['distinct disaster_number as disaster_number', 'declaration_title'],
          disasterNamePath = (view_id) => ['dama', pgEnv,  "viewsbyId", view_id, "options"];

    useEffect( () => {
        async function getData(){
            if(!geoid){
                setStatus('Please Select a Geography');
            }else{
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath).then(async res => {

                const deps = get(res, ["json", ...dependencyPath, "dependencies"]);

                const fusionView = deps.find(d => d.type === "fusion");
                if(!fusionView) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setFusionViewId(fusionView.view_id)
                const dataPath = hazard !== 'total' ?
                    ["fusion", pgEnv, "source", fusionSourceId, "view", fusionView.view_id, "byGeoid", geoid,
                        'hazards', JSON.stringify([hazard]),
                        "lossByYearByDisasterNumber"] :
                    ["fusion", pgEnv, "source", fusionSourceId, "view", fusionView.view_id, "byGeoid", geoid,
                        "lossByYearByDisasterNumber"];

                setDataPath(dataPath);

                const lossRes = await falcor.get(
                    dataPath,
                    ['dama', pgEnv, 'views', 'byId', fusionView.view_id, 'attributes', ['source_id', 'view_id', 'version']]
                );
                console.log('lossRes', get(lossRes,
                    ['json', ...dataPath], []), lossRes)

                const disasterNumbers = get(lossRes,
                    ['json', ...dataPath], [])
                    .map(dns => dns.disaster_number)
                    ?.filter(dns => dns !== 'SWD')
                    .sort((a, b) => +a - +b);

                if(disasterNumbers?.length){
                    const ddcView = deps.find(d => d.type === "disaster_declarations_summaries_v2");

                    setDisasterDecView(ddcView?.view_id);
                    await falcor.get([...disasterNamePath(ddcView.view_id), JSON.stringify({ filter: { disaster_number: disasterNumbers.sort((a, b) => +a - +b)}}),
                        'databyIndex', {from: 0, to: disasterNumbers.length - 1}, disasterNameAttributes]);
                }
                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, geoid, hazard]);

    const disasterNames =
        Object.values(get(falcorCache, [...disasterNamePath(disasterDecView)], {}))
            .reduce((acc, d) => [...acc, ...Object.values(d?.databyIndex || {})], [])
            .reduce((acc, disaster) => {
                acc[disaster['distinct disaster_number as disaster_number']] = disaster.declaration_title;
                return acc;
                }, {});

    const lossByYearByDisasterNumber =
            get(falcorCache, [...dataPath, "value"], []),
        { processed_data: chartDataActiveView, disaster_numbers } =
                    ProcessDataForMap(lossByYearByDisasterNumber, disasterNames);

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes'], {});

    useEffect(() =>
            onChange(JSON.stringify(
                {
                    chartDataActiveView,
                    disaster_numbers,
                    attributionData,
                    ealViewId,
                    fusionViewId,
                    status,
                    geoid,
                    hazard,
                    dataPath
                })),
        [chartDataActiveView, disaster_numbers, attributionData, status, ealViewId, fusionViewId, geoid, hazard, dataPath]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                    <HazardSelector hazard={hazard} setHazard={setHazard} showTotal={true}/>
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <>
                                <RenderBarChart
                                    chartDataActiveView={chartDataActiveView}
                                    disaster_numbers={disaster_numbers}
                                    attributionData={attributionData}
                                    hazard={hazard}
                                    baseUrl={baseUrl}
                                />
                            </>
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
    return (
        <div className='relative w-full p-6'>
            {
                data?.status ?
                    <div className={'p-5 text-center'}>{data?.status}</div> :
                    <RenderBarChart {...JSON.parse(value)} baseUrl={'/'}/>
            }
        </div>
    )           
}


export default {
    "name": 'Graph: Historic Loss by Disaster Number',
    "type": 'Bar Chart',
    "EditComp": Edit,
    "ViewComp": View
}