import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import { RenderStatBoxes } from "./components/RenderStatBoxes.jsx";
import { ProcessDataForMap } from "./utils";
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySearch/index.jsx";
import { Loading } from "~/utils/loading.jsx"

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
    const [geoid, setGeoid] = useState(data?.geoid || '36001');

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
                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, geoid]);

    const lossByYearByDisasterNumber =
            get(falcorCache,
                ["fusion", pgEnv, "source", fusionSourceId, "view", fusionViewId, "byGeoid", geoid,
                    "lossByYearByDisasterNumber", "value"], []),
        { total } = ProcessDataForMap(lossByYearByDisasterNumber);

    const numDeclaredEvents = lossByYearByDisasterNumber.filter(d => d.disaster_number !== 'SWD')?.length,
        numNonDeclaredEvents = lossByYearByDisasterNumber.reduce((acc, d) => acc + +(d.disaster_number === 'SWD' ? d.numevents : 0), 0)

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes'], {});

    useEffect(() =>
            onChange(JSON.stringify(
                {
                    attributionData,
                    ealViewId,
                    fusionViewId,
                    status,
                    geoid,
                    numDeclaredEvents,
                    numNonDeclaredEvents,
                    total
                })),
        [attributionData, status, ealViewId, fusionViewId, geoid, numDeclaredEvents, numNonDeclaredEvents, total]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <>
                                <RenderStatBoxes
                                    numNonDeclaredEvents={numNonDeclaredEvents}
                                    numDeclaredEvents={numDeclaredEvents}
                                    total={total}
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
                    <RenderStatBoxes {...data} baseUrl={'/'}/>
            }
        </div>
    )           
}


export default {
    "name": 'Card: Declared vs Non-Declared Loss',
    "type": 'Pie Chart',
    "EditComp": Edit,
    "ViewComp": View
}