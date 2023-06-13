import React, {useEffect, useState} from "react"
import {useFalcor} from "~/modules/avl-falcor"
import {hazardsMeta} from '~/utils/colors'
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySearch/index.jsx";
import {isJson} from "../../../../../../utils/macros.jsx";
import get from "lodash/get.js";
import {pgEnv} from "~/utils";
import {RenderGridOrBox} from "./components/RenderGridOrBox.jsx";
import {Loading} from "../../../../../../utils/loading.jsx";
import {ButtonSelector} from "../buttonSelector/index.jsx";

const Edit = ({value, onChange}) => {
    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 692);

    const [loading, setLoading] = useState(true);
    const [hazard, setHazard] = useState(cachedData?.hazard || 'total');
    const [type, setType] = useState(cachedData?.type || 'card');
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');
    const [isTotal, setIsTotal] = useState(cachedData?.isTotal || (hazard === 'total' && type === 'card'));

    const {falcor, falcorCache} = useFalcor();
    const [nriIds, setNriIds] = useState({source_id: null, view_id: null});
    const [fusionViewId, setfusionViewId] = useState({source_id: null, view_id: null});
    const [deps, setDeps] = useState([ealViewId]);

    const freqCol =
            Object.keys(hazardsMeta)
                .reduce((acc, key) =>
                        ({
                            ...acc,
                            ...{
                                [key]: `sum(${get(hazardsMeta, [key, "prefix"], "total")}_afreq) as ${get(hazardsMeta, [key, "prefix"], "total")}_freq`
                            }
                        })
                    , {}),
        expCol =
            Object.keys(hazardsMeta)
                .reduce((acc, key) => (
                    {
                        ...acc,
                        [key]: `sum(${get(hazardsMeta, [key, "prefix"], "total")}_expt) as ${get(hazardsMeta, [hazard, "prefix"], "total")}_exp`
                    }
                ), {});

    const npCol = isTotal ? "national_percent_total" : "national_percent_hazard",
        spCol = isTotal ? "state_percent_total" : "state_percent_hazard",
        ealCol = isTotal ? "avail_eal_total" : "avail_eal";

    let
        fipsCol = `substring(stcofips, 1, ${geoid.length})`,
        nriOptions = JSON.stringify({
            filter: {[fipsCol]: [geoid]},
            groupBy: [fipsCol]
        }),
        nriPath = ({view_id}) => ["dama", pgEnv, "viewsbyId", view_id, "options", nriOptions];
    let
        actualLossCol = "sum(fusion_property_damage) + sum(fusion_crop_damage) + sum(swd_population_damage) as actual_damage",
        geoidCOl = `substring(geoid, 1, ${geoid.length})`,
        fusionAttributes = [`${geoidCOl} as geoid`, "nri_category", actualLossCol],
        fusionAttributesTotal = [`${geoidCOl} as geoid`, actualLossCol],
        fusionOptions = JSON.stringify({
            aggregatedLen: true,
            filter: isTotal ? {[geoidCOl]: [geoid]} : {[geoidCOl]: [geoid]},
            groupBy: [geoidCOl, "nri_category"]
        }),
        fusionOptionsTotal = JSON.stringify({
            aggregatedLen: true,
            filter: isTotal ? {[geoidCOl]: [geoid]} : {[geoidCOl]: [geoid]},
            groupBy: [geoidCOl]
        }),
        fusionPath = ({view_id}) => ["dama", pgEnv, "viewsbyId", view_id, "options", fusionOptions],
        fusionPathTotal = ({view_id}) => ["dama", pgEnv, "viewsbyId", view_id, "options", fusionOptionsTotal];

    React.useEffect(() => {
        async function getData() {
            if (!geoid) {
                setStatus('Please Select a Geography');
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);

            await falcor.get(
                ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", ealViewId],
                ["comparative_stats", pgEnv, "byEalIds", "source", ealSourceId, "view", ealViewId, "byGeoid", geoid]
            ).then(async (res) => {
                const deps = get(res, ["json", "dama", pgEnv, "viewDependencySubgraphs", "byViewId", ealViewId, "dependencies"]);
                const nriView = deps.find(d => d.type === "nri");
                const fusionView = deps.find(d => d.type === "fusion");

                if (!fusionView) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setNriIds(nriView);
                setfusionViewId(fusionView);

                const lenRes = await falcor.get([...fusionPath(fusionView), "length"]);
                const len = get(lenRes, ["json", ...fusionPath(fusionView), "length"], 0);

                const fusionByIndexRoute = [...fusionPath(fusionView), "databyIndex", {
                    from: 0,
                    to: len - 1
                }, fusionAttributes];
                const fusionTotalByIndexRoute = [...fusionPathTotal(fusionView), "databyIndex", {
                    from: 0,
                    to: 0
                }, fusionAttributesTotal];

                setDeps([ealViewId, nriView.view_id, fusionView.view_id]);

                const attributionRoute = ['dama', pgEnv, 'views', 'byId',
                    [ealViewId, nriView.view_id, fusionView.view_id],
                    'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']];

                const routes = isTotal && len ? [fusionByIndexRoute, fusionTotalByIndexRoute, attributionRoute] :
                    !isTotal && len ? [[...nriPath(nriView), "databyIndex", {
                        from: 0,
                        to: len - 1
                    }, [...Object.values(freqCol), ...Object.values(expCol)]], fusionByIndexRoute, fusionTotalByIndexRoute, attributionRoute] : [];
                await falcor.get(...routes);
                setLoading(false);
            });
        }

        getData();
    }, [ealViewId, geoid, hazard, type, falcorCache]);

    const size =
        type === 'card' && hazard !== 'total' ? 'small' :
            type === 'card' && hazard === 'total' ? 'large' : 'small';

    const attributionDataFn = view_id => get(falcorCache, ['dama', pgEnv, 'views', 'byId', view_id, 'attributes'], {});

    const attributionData = deps.map(d => (
        {
            source_id: attributionDataFn(d)?.source_id,
            view_id: attributionDataFn(d)?.view_id,
            version: attributionDataFn(d)?.version,
            _modified_timestamp: attributionDataFn(d)?._modified_timestamp?.value
        }
    ))

    const hazardPercentileArray =
        get(falcorCache, ["comparative_stats", pgEnv, "byEalIds", "source", ealSourceId, "view", ealViewId, "byGeoid", geoid, "value"], [])
            .filter(row => row.geoid === geoid)
            .map(d => ({
                key: d.nri_category,
                label: hazardsMeta[d.nri_category].name,
                color: hazardsMeta[d.nri_category].color,
                value: (d.avail_eal * 100 / d.avail_eal_total).toFixed(2),
                eal: get(d, ealCol, 0),
                nationalPercentile: get(d, npCol, 0) * 100,
                statePercentile: get(d, spCol, 0) * 100,
                actualLoss: (Object.values(
                    get(falcorCache,
                        isTotal ? [...fusionPathTotal(fusionViewId), "databyIndex"] : [...fusionPath(fusionViewId), "databyIndex"],
                        {}))
                    .find(fc => fc.nri_category === d.nri_category) || {})[actualLossCol],
                exposure: get(falcorCache, [...nriPath(nriIds), "databyIndex", 0, expCol[d.nri_category]]),
                frequency: get(falcorCache, [...nriPath(nriIds), "databyIndex", 0, freqCol[d.nri_category]], 0)
            }))
            .sort((a, b) => +b.value - +a.value);

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        ealViewId,
                        fusionViewId,
                        status,
                        geoid,
                        hazard, hazardPercentileArray, size, isTotal, type, attributionData
                    }))
            }
        },
        [ealViewId, geoid, falcorCache, hazard, hazardPercentileArray, size, isTotal, type, attributionData]);
    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId}
                                               className={'flex-row-reverse'}/>
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <ButtonSelector
                        label={'Component Type:'}
                        types={['card', 'grid']}
                        type={type}
                        setType={e => {
                            setHazard(e === 'grid' ? null : 'total');
                            setIsTotal(e === 'card')
                            setType(e);
                        }}
                    />
                    <div className='flex justify-between'>
                        <label className={'shrink-0 pr-2 py-1 my-1'}>Hazard Type:</label>
                        <select
                            className='w-full shrink my-1 p-2 bg-white rounded-md'
                            onChange={e => {
                                setIsTotal(e.target.value === 'total')
                                setHazard(e.target.value)
                            }}
                            disabled={type === 'grid'}
                            value={hazard}
                        >
                            {
                                type === 'grid' ?
                                    <option value={' '}>Not Applicable</option> :
                                    <option value='total'>Total</option>
                            }
                            { type === 'card' &&
                                Object.keys(hazardsMeta).map((k, i) => {
                                    return <option value={k}>{hazardsMeta[k].name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='relative w-full p-1'>
                    {
                        loading ? <Loading/> :
                            status ? <div className={'p-5 text-center'}>{status}</div> :
                                <div>
                                    <RenderGridOrBox
                                        hazard={hazard}
                                        hazardPercentileArray={hazardPercentileArray}
                                        size={size}
                                        isTotal={isTotal}
                                        type={type}
                                        attributionData={attributionData}
                                        baseUrl={'/'}
                                    />
                                </div>
                    }
                </div>
            </div>
        </div>
    )
}


const View = ({value}) => {
    if (!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] :
        JSON.parse(value)

    return (
        <div className='relative w-full  py-2 px-8'>
            <RenderGridOrBox {...data} baseUrl={'/'}/>
        </div>
    )
}


export default {
    "name": 'Card: Hazard Risk',
    "type": 'Card/Grid',
    "EditComp": Edit,
    "ViewComp": View
}