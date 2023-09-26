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
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let data = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(data?.ealViewId || 837);
    const fusionSourceId= 336;
    const [fusionViewId, setFusionViewId] = useState(data?.fusionViewId || 834);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(data?.status);
    const [geoid, setGeoid] = useState(data?.geoid || '36');
    const [hazard, setHazard] = useState(data?.hazard || 'total');
    const [consequence, setConsequence] = useState(data?.consequence || '_td');
    const [base, setBase] = useState(data?.base || 'year');
    const [dataPath, setDataPath] = useState([]);

    const dependencyPath = ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", ealViewId];

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
                const dataPath =
                    ["fusion", pgEnv, "source", fusionSourceId, "view", fusionView.view_id,
                        "byGeoid", geoid,
                        base === 'year' ? "lossByYearByHazardType" : "lossByMonthByHazardType"
                    ];

                setDataPath(dataPath);

                await falcor.get(
                    dataPath,
                    ['dama', pgEnv, 'views', 'byId', fusionView.view_id, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']]
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, geoid, hazard, base]);

    const lossByYearByHazardType = get(falcorCache, [...dataPath, "value"], []),
        { processed_data: chartDataActiveView } = ProcessDataForMap(lossByYearByHazardType, base);
    console.log('??', base, dataPath, lossByYearByHazardType, chartDataActiveView)
    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes'], {});

    useEffect(() =>
            onChange(JSON.stringify(
                {
                    chartDataActiveView,
                    attributionData,
                    ealViewId,
                    fusionViewId,
                    status,
                    geoid,
                    hazard,
                    dataPath,
                    consequence,
                    base
                })),
        [chartDataActiveView, attributionData, status, ealViewId, fusionViewId, geoid, hazard, dataPath, consequence, base]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                    <HazardSelectorSimple hazard={hazard} setHazard={   setHazard} showTotal={true}/>
                    <ButtonSelector
                        label={'Base:'}
                        types={[
                            {value: 'year', label: 'Year'},
                            {value: 'month', label: 'Month'}
                        ]}
                        type={base}
                        setType={e => {
                            setDataPath([])
                            setBase(e)
                        }}
                    />
                    <ButtonSelector
                        label={'Loss Type:'}
                        types={[
                            {value: '_pd', label: 'Property'},
                            {value: '_cd', label: 'Crop'},
                            {value: '_td', label: 'Total'}
                        ]}
                        type={consequence}
                        setType={setConsequence}
                    />
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <>
                                <RenderBarChart
                                    base={base}
                                    chartDataActiveView={chartDataActiveView}
                                    attributionData={attributionData}
                                    hazard={hazard}
                                    consequence={consequence}
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
    "name": 'Graph: Historic Loss by Hazard Type',
    "type": 'Bar Chart',
    "EditComp": Edit,
    "ViewComp": View
}