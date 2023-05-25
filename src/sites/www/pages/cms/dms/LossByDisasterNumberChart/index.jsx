import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "../../../../../../utils/macros.jsx";
import { RenderBarChart } from "./components/RenderBarChart.jsx";
import { ProcessDataForMap } from "./utils"
import VersionSelector from "../versionSelector";
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySeach/index.jsx";
import { Loading } from "./components/loading.jsx"

const GeographySelector = ({value, onChange}) => (
    <select
        className='bg-slate-100 p-2 w-full border-b'
        value={value}
        onChange={e => onChange(e.target.value)}
    >
        <option key={'select a version'} selected="true" disabled="disabled" className="ml-2  truncate">
            Select a Geography
        </option>
        {
            [{label: 'New York State', value: '36'}, {label: 'Albany County', value: '36001'}]
                .map((v, i) => (
                    <option key={i} value={v.value} className="ml-2  truncate">{v.label}</option>
                ))
        }
    </select>
)

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let data = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const ealSourceId = 229;
    const [ealViewId, setEalViewId] = useState(data?.ealViewId || 599);
    const fusionSourceId= 336;
    const [fusionViewId, setFusionViewId] = useState(data?.fusionViewId || 596);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(data?.status);
    const [geoid, setGeoid] = useState(data?.geoid || '36001');

    console.log('d?', data)
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

                const lossRes = await falcor.get(
                    ["fusion", pgEnv, "source", fusionSourceId, "view", fusionView.view_id, "byGeoid", geoid, ["lossByYearByDisasterNumber"]],
                    ['dama', pgEnv, 'views', 'byId', fusionView.view_id, 'attributes', ['source_id', 'view_id', 'version']]
                );
                console.log('useEffect?', lossRes)
                const disasterNumbers = get(lossRes,
                    ['json', "fusion", pgEnv, "source", fusionSourceId, "view",
                        fusionView.view_id, "byGeoid", geoid, "lossByYearByDisasterNumber"], [])
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
    }, [geoid, ealViewId, geoid]);

    const disasterNames =
        Object.values(get(falcorCache, [...disasterNamePath(disasterDecView)], {}))
            .reduce((acc, d) => [...acc, ...Object.values(d?.databyIndex || {})], [])
            .reduce((acc, disaster) => {
                acc[disaster['distinct disaster_number as disaster_number']] = disaster.declaration_title;
                return acc;
                }, {});

    const lossByYearByDisasterNumber =
            get(falcorCache,
                ["fusion", pgEnv, "source", fusionSourceId, "view", fusionViewId, "byGeoid", geoid,
                    "lossByYearByDisasterNumber", "value"], []),
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
                    geoid
                })),
        [chartDataActiveView, disaster_numbers, attributionData, status, ealViewId, fusionViewId, geoid]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <>
                                <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                                <RenderBarChart
                                    chartDataActiveView={chartDataActiveView}
                                    disaster_numbers={disaster_numbers}
                                    attributionData={attributionData}
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
    "name": 'ColorBox',
    "EditComp": Edit,
    "ViewComp": View
}