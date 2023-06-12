import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import { RenderDisasterLossStats } from "./components/RenderDisasterLossStats.jsx";
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

    const [disasterLossView, setDisasterLossView] = useState();
    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 692);
    const [disasterNumber, setDisasterNumber] = useState(cachedData?.disasterNumber);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];

    const
        geoIdCol = geoid?.length === 2 ? "substring(geoid, 1, 2)" : geoid?.length === 5 ? "geoid" : `'all'`,
        disasterDetailsAttributes = {
            disaster_number: "disaster_number",
            geoid: `${geoIdCol} as geoid`,
            fema_property_damage: "sum(fema_property_damage) as fema_property_damage",
            ihp_loss: "sum(ihp_loss) as ihp_loss",
            pa_loss: "sum(pa_loss) as pa_loss",
            sba_loss: "sum(sba_loss) as sba_loss",
            nfip_loss: "sum(nfip_loss) as nfip_loss",
            fema_crop_damage: "sum(fema_crop_damage) as fema_crop_damage"
        },
        disasterDetailsOptions = JSON.stringify({
            filter: geoid ? { disaster_number: [disasterNumber], [geoIdCol]: [geoid] } : { disaster_number: [disasterNumber] },
            exclude: {fema_incident_begin_date: ['null']},
            groupBy: [1, 2]
        }),
        disasterDetailsPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options", disasterDetailsOptions];

    useEffect( () => {
        async function getData(){
            if(!geoid|| !disasterNumber){
                setStatus('Please Select a Geography and a Disaster.');
                return Promise.resolve();
            }else{
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);
                const dlsDeps = deps.find(dep => dep.type === "disaster_loss_summary");

                if(!dlsDeps) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setDisasterLossView(dlsDeps.view_id)

                await falcor.get(
                    [...disasterDetailsPath(dlsDeps.view_id), "databyIndex", { from: 0, to: 0 }, Object.values(disasterDetailsAttributes)],
                    ['dama', pgEnv, 'views', 'byId', dlsDeps.view_id, 'attributes', ['source_id', 'view_id', 'version']]
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, disasterNumber]);
    
    const totalLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.fema_property_damage], 0) +
        get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.fema_crop_damage], 0);
    const ihpLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.ihp_loss], 0);
    const paLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.pa_loss], 0);
    const sbaLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.sba_loss], 0);
    const nfipLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.nfip_loss], 0);
    const usdaLoss = get(falcorCache, [...disasterDetailsPath(disasterLossView), "databyIndex", 0, disasterDetailsAttributes.fema_crop_damage], 0);

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', disasterLossView, 'attributes'], {});

    useEffect(() => {
            if(!loading){
                onChange(JSON.stringify(
                    {
                        ealViewId,
                        disasterLossView,
                        attributionData,
                        status,
                        geoid,
                        disasterNumber,
                        totalLoss, ihpLoss, paLoss, sbaLoss, nfipLoss, usdaLoss
                    }))
            }
        },
        [status, ealViewId, attributionData, geoid, disasterNumber, totalLoss, ihpLoss, paLoss, sbaLoss, nfipLoss, usdaLoss]);

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
                                <RenderDisasterLossStats
                                    totalLoss={totalLoss}
                                    ihpLoss={ihpLoss}
                                    paLoss={paLoss}
                                    sbaLoss={sbaLoss}
                                    nfipLoss={nfipLoss}
                                    usdaLoss={usdaLoss}
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
                    <RenderDisasterLossStats {...data} baseUrl={'/'}/>
            }
        </div>
    )           
}


export default {
    "name": 'Card: FEMA Disaster Loss Summary',
    "type": 'Hero Stats',
    "EditComp": Edit,
    "ViewComp": View
}