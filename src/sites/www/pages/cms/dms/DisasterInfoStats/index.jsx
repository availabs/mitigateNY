import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import { RenderDisasterInfoStats } from "./components/RenderDisasterInfoStats.jsx";
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySearch/index.jsx";
import DisasterSearch from "../DisasterSearch/index.jsx";
import { Loading } from "~/utils/loading.jsx";

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const ealSourceId = 229;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 599);
    const [disasterNumber, setDisasterNumber] = useState(cachedData?.disasterNumber || 4420);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];

    const
        disasterDetailsAttributes = [
            "disaster_number",
            "declaration_title",
            "declaration_date",
            "incident_type",
            'ARRAY_AGG(distinct fips_state_code || fips_county_code) as geoid'
        ],
        disasterDetailsOptions = JSON.stringify({
            filter: { disaster_number: [disasterNumber] },
            groupBy: [1, 2, 3, 4]
        }),
        disasterDetailsPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options", disasterDetailsOptions, "databyIndex"];

    useEffect( () => {
        async function getData(){
            if(!geoid){
                setStatus('Please Select a Geography');
            }else{
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);
                const ddsDeps = deps.find(d => d.type === "disaster_declarations_summaries_v2");

                if(!ddsDeps) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setDisasterDecView(ddsDeps.view_id)

                falcor.get(
                    [...disasterDetailsPath(ddsDeps.view_id), { from: 0, to: 0 }, disasterDetailsAttributes],
                    ['dama', pgEnv, 'views', 'byId', ddsDeps.view_id, 'attributes', ['source_id', 'view_id', 'version']]
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, disasterNumber]);

    const title = get(falcorCache, [...disasterDetailsPath(disasterDecView), 0, "declaration_title"]);
    const incidentType = get(falcorCache, [...disasterDetailsPath(disasterDecView), 0, "incident_type"]);
    const declarationDate = get(falcorCache, [...disasterDetailsPath(disasterDecView), 0, "declaration_date", "value"], "");
    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', disasterDecView, 'attributes'], {});

    useEffect(() => {
            if(!loading){
                onChange(JSON.stringify(
                    {
                        ealViewId,
                        disasterDecView,
                        attributionData,
                        status,
                        geoid,
                        disasterNumber,
                        title, incidentType, declarationDate
                    }))
            }
        },
        [status, ealViewId, geoid, attributionData, disasterNumber, title, incidentType, declarationDate]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                    <DisasterSearch
                        view_id={ealViewId}
                        value={disasterNumber}
                        geoid={geoid}
                        onChange={setDisasterNumber}
                        className={'flex-row-reverse'}
                    />
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                                <RenderDisasterInfoStats
                                    title={title}
                                    incidentType={incidentType}
                                    declarationDate={declarationDate}
                                    attributionData={attributionData}
                                    baseUrl={baseUrl}
                                />
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
                    <RenderDisasterInfoStats {...data} baseUrl={'/'}/>
            }
        </div>
    )           
}


export default {
    "name": 'Card: FEMA Disaster Info',
    "type": 'Hero Stats',
    "EditComp": Edit,
    "ViewComp": View
}