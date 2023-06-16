import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch/index.jsx";
import {Loading} from "~/utils/loading.jsx";
import {metaData} from "./config.js";
import {Link} from "react-router-dom";
import {formatDate} from "../../../../../../utils/macros.jsx";
import {ButtonSelector} from "../../components/buttonSelector/index.jsx";
import {RenderColorPicker} from "../../components/colorPicker/colorPicker.jsx";
import {scaleThreshold} from "d3-scale";
import {getColorRange} from "../../../../../../pages/DataManager/utils/color-ranges.js";
import ckmeans from '~/utils/ckmeans';
import {RenderMap} from "../../components/Map/RenderMap.jsx";
import {HazardSelector} from "./components/HazardSelector.jsx";
import {hazardsMeta} from "../../../../../../utils/colors.jsx";

const getDomain = (data = [], range = []) => {
    if (!data?.length || !range?.length) return [];
    return data?.length && range?.length ? ckmeans(data, Math.min(data?.length, range?.length)).map(d => parseInt(d)) : [];
}
const getColorScale = (data, colors) => {
    const domain = getDomain(data, colors)

    return scaleThreshold()
        .domain(domain)
        .range(colors);
}
const getGeoColors = ({geoid, data = [], columns = [], paintFn, colors = [], ...rest}) => {
    if (!data?.length || !colors?.length) return {};
    const geoids = data.map(d => d.geoid);
    const stateFips = (geoid?.substring(0, 2) || geoids[0] || '00').substring(0, 2);
    const geoColors = {}

    const colorScale = getColorScale(
        data.map((d) => paintFn ? paintFn(d) : d[columns?.[0]]).filter(d => d),
        colors
    );
    const domain = getDomain(
        data.map((d) => paintFn ? paintFn(d) : d[columns?.[0]]).filter(d => d),
        colors
    )
    for (let id = 0; id <= 999; id += 1) {
        const gid = stateFips + id.toString().padStart(3, '0');

        const record = data.find(d => d.geoid === gid) || {};
        const value = paintFn ? paintFn(record) : record[columns?.[0]];
        geoColors[gid] = geoids.includes(gid) && value ? colorScale(value) : '#CCC';
    }
    return {geoColors, domain};
}
const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 692);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [hazard, setHazard] = useState(cachedData?.hazard || 'hail');
    const [typeId, setTypeId] = useState(cachedData?.typeId);
    const [data, setData] = useState(cachedData?.data);
    const [attribute, setAttribute] = useState(cachedData?.attribute);
    const [consequence, setConsequance] = useState(cachedData?.consequence);
    const [mapFocus, setMapfocus] = useState(cachedData?.mapFocus);
    const [numColors, setNumColors] = useState(cachedData?.numColors || 9);
    const [shade, setShade] = useState(cachedData?.shade || 'Oranges');
    const [colors, setColors] = useState(cachedData?.colors || getColorRange(9, "Oranges", false));
    const [title, setTitle] = useState(cachedData?.title);

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id],
        geomColName = `stcofips`,
        columns = [`${hazardsMeta[hazard]?.prefix}_${attribute}${consequence || ``}`],
        options = JSON.stringify({
            filter: {[`substring(stcofips, 1, ${geoid?.length})`]: [geoid]},
        }),
        attributes = {
            geoid: `${geomColName} as geoid`,
            ...(columns || [])
                .reduce((acc, curr) => ({...acc, [curr]: `${curr}`}), {})
        },
        dataPath = view_id => ['dama', pgEnv, 'viewsbyId', view_id, 'options', options];

    const attributionPath = view_id => ['dama', pgEnv, 'views', 'byId', view_id, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']];


    useEffect(() => {
        // get required data, pass paint properties as prop.
        async function getData() {
            if (!geoid || !attribute || (attribute !== 'afreq' && !consequence)) {
                !geoid && setStatus('Please Select a Geography.');
                !attribute && setStatus('Please Select an Attribute.');
                !consequence && setStatus('Please Select a Consequence.');
                return Promise.resolve();
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const stateView = deps.find(dep => dep.type === "tl_state");
                const typeId = deps.find(dep => dep.type === 'nri');

                if (!typeId) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }
                setTypeId(typeId.view_id);
                setTitle(metaData.title(hazardsMeta[hazard].name, attribute, consequence))
                const dataRes = await falcor.get(
                    [...dataPath(typeId.view_id), 'length'],
                    attributionPath(typeId.view_id)
                );

                const len = get(dataRes, ['json', ...dataPath(typeId.view_id), 'length']);

                await len && falcor.get([...dataPath(typeId.view_id), 'databyIndex', {
                    from: 0,
                    to: len - 1
                }, Object.values(attributes)])
                    .then(async res => {
                        let data = Object.values(get(res, ['json', ...dataPath(typeId.view_id), 'databyIndex'], {}));
                        data = [...Array(len).keys()].map(i => {
                            return Object.keys(attributes).reduce((acc, curr) => ({
                                ...acc,
                                [curr]: data[i][attributes[curr]]
                            }), {});
                        });

                        setData(data);

                        if (!data?.length) return Promise.resolve();

                        const geomColTransform = [`st_asgeojson(st_envelope(ST_Simplify(geom, ${false && geoid?.length === 5 ? `0.1` : `0.5`})), 9, 1) as geom`],
                            geoIndices = {from: 0, to: 0},
                            stateFips = get(data, [0, 'geoid']) || geoid?.substring(0, 2),
                            geoPath = ({view_id}) =>
                                ['dama', pgEnv, 'viewsbyId', view_id,
                                    'options', JSON.stringify({filter: {geoid: [false && geoid?.length === 5 ? geoid : stateFips.substring(0, 2)]}}),
                                    'databyIndex'
                                ];
                        const geomRes = await falcor.get([...geoPath(stateView), geoIndices, geomColTransform]);
                        const geom = get(geomRes, ["json", ...geoPath(stateView), 0, geomColTransform]);
                        if (geom) {
                            setMapfocus(get(JSON.parse(geom), 'bbox'));
                        }
                    })
                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, numColors, shade, colors, hazard, attribute, consequence]);

    const {geoColors, domain} = getGeoColors({geoid, data, columns: columns, paintFn: metaData.paintFn, colors});

    console.log('geoColos', Object.values(geoColors || {}).filter(g => g !== '#CCC'))
    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', typeId, 'attributes'], {});
    const layerProps =
        useMemo(() => ({
            ccl: {
                view: metaData,
                data,
                geoColors,
                mapFocus,
                domain,
                colors,
                title,
                hazard,
                attribute,
                consequence,
                change: e => onChange(JSON.stringify({
                    ...e,
                    ealViewId,
                    geoid,
                    status,
                    hazard,
                    attribute,
                    consequence,
                    typeId,
                    attributionData,
                    data,
                    geoColors,
                    mapFocus,
                    domain,
                    numColors,
                    colors
                }))
            }
        }), [ealViewId, geoid, hazard, attribute, consequence, colors, data, geoColors]);
    // console.log('layer props colors',
    //     Object.values( layerProps.ccl.geoColors || {}).filter(g => g !== '#CCC'))
    // geography selector
    // bonus: geography level selector
    // hazard selector // single or all
    // attribute selector // freq, eal, exp, risks, riskr
    // conseq selector // b, a, p, pe, t

    // fetch <hazard_prefix>_<attribute>_<conseq> for the selected geography

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
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <HazardSelector hazard={hazard} setHazard={setHazard}/>
                    <ButtonSelector
                        label={'Attribute:'}
                        types={
                            Object.keys(metaData.attributes)
                                .map(t => ({label: t.replace('_', ' '), value: metaData.attributes[t]}))
                              }
                        type={attribute}
                        setType={e => {
                            setAttribute(e);
                            e === 'afreq' && setConsequance(null)
                        }}
                    />
                    <ButtonSelector
                        label={'Consequence:'}
                        types={
                            Object.keys(metaData.consequences)
                                .map(t => ({label: t.replace('_', ' '), value: metaData.consequences[t]}))
                              }
                        type={consequence}
                        setType={setConsequance}
                        disabled={attribute === 'afreq'}
                        disabledTitle={'Frequency is independent of Consequence.'}
                    />
                    <RenderColorPicker
                        title={'Colors: '}
                        numColors={numColors}
                        setNumColors={setNumColors}
                        shade={shade}
                        setShade={setShade}
                        colors={colors}
                        setColors={setColors}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <React.Fragment>
                                <div className={`flex-none h-[500px] w-full p-1`}>
                                    <RenderMap
                                        falcor={falcor}
                                        layerProps={layerProps}
                                        legend={{domain, range: colors, title}}
                                    />
                                </div>
                                <div className={'flex flex-row text-xs text-gray-700 p-1'}>
                                    <label>Attribution:</label>
                                    <div className={'flex flex-col pl-1'}>
                                        <Link
                                            to={`/${baseUrl}/source/${attributionData?.source_id}/versions/${attributionData?.view_id}`}>
                                            {attributionData?.version} ({formatDate(attributionData?._modified_timestamp?.value)})
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
    if (!value) return ''

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
                        <img alt='Choroplath Map' src={get(data, ['img'])}/>
                        <div className={'flex flex-row text-xs text-gray-700 p-1'}>
                            <label>Attribution:</label>
                            <div className={'flex flex-col pl-1'}>
                                <Link
                                    to={`/${baseUrl}/source/${attributionData?.source_id}/versions/${attributionData?.view_id}`}>
                                    {attributionData?.version} ({formatDate(attributionData?._modified_timestamp?.value)})
                                </Link>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}


export default {
    "name": 'Map: NRI',
    "type": 'Map',
    "EditComp": Edit,
    "ViewComp": View
}