import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {metaData} from "./config.js";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import {RenderColorPicker} from "../../components/colorPicker.jsx";
import {scaleThreshold} from "d3-scale";
import {getColorRange} from "../../../../../../pages/DataManager/utils/color-ranges.js";
import ckmeans from '~/utils/ckmeans';
import {RenderMap} from "../../components/Map/RenderMap.jsx";
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {hazardsMeta} from "../../../../../../utils/colors.jsx";
import {Attribution} from "../../components/attribution.jsx";

const getDomain = (data = [], range = []) => {
    if (!data?.length || !range?.length) return [];
    return data?.length && range?.length ? ckmeans(data, Math.min(data?.length, range?.length)) : [];
}
const getColorScale = (data, colors) => {
    const domain = getDomain(data, colors)

    return scaleThreshold()
        .domain(domain)
        .range(colors);
}
const getGeoColors = ({geoid, data = [], columns = [], geoAttribute, paintFn, colors = [], ...rest}) => {
    if (!data?.length || !colors?.length) return {};

    const geoids = data.map(d => d[geoAttribute]);
    const stateFips = (geoid?.substring(0, 2) || geoids[0] || '00').substring(0, 2);
    const geoColors = {}
    const geoLayer = geoids[0]?.toString().length === 5 ? 'counties' : 'tracts';
    const colorScale = getColorScale(
        data.map((d) => paintFn ? paintFn(d) : +d[columns?.[0]]).filter(d => d),
        colors
    );
    const domain = getDomain(
        data.map((d) => paintFn ? paintFn(d) : +d[columns?.[0]]).filter(d => d && d >= 0),
        colors
    )

    if (geoid?.length === 5) {
        geoColors[geoid] = '#d3d3d3'
    } else {
        for (let id = 0; id <= 999; id += 1) {
            const gid = stateFips + id.toString().padStart(3, '0');

            const record = data.find(d => d.geoid === gid) || {};
            const value = paintFn ? paintFn(record) : record[columns?.[0]];
            geoColors[gid] = geoids.includes(gid) && value ? colorScale(value) : '#d3d3d3';
        }
    }
    console.log('geocolors', geoColors, data)
    return {geoColors, domain, geoLayer: 'counties'};
}

const parseJson = (value) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        return null;
    }
}
const makeFeatures = ({data = [], hazard}) => useMemo(() => {
    const radiusScale = 2;
    const geoJson = {
        type: 'FeatureCollection',
        features: data.map(d => ({
            'type': 'Feature',
            'properties': {color: hazardsMeta[hazard]?.color,borderColor: hazardsMeta[hazard]?.color, radius: radiusScale, ...d},
            'geometry': parseJson(d['st_asgeojson(st_centroid(footprint)) as building_centroid'])
        }))
    }

    return geoJson
}, [data])

const Edit = ({value, onChange, size}) => {

    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [dataSources, setDataSources] = useState(cachedData?.dataSources || []);
    const [dataSource, setDataSource] = useState(cachedData?.dataSource);
    const [version, setVersion] = useState(cachedData?.version);
    const [geoAttribute, setGeoAttribute] = useState(cachedData?.geoAttribute);
    const [buildingType, setBuildingType] = useState(cachedData?.buildingType || JSON.stringify({value_source: ['ogs']}));
    const [floodPlain, setFloodPlain] = useState(cachedData?.floodPlain || '{}');
    const [hazard, setHazard] = useState(cachedData?.hazard || 'riverine');
    const [hazardScoreThreshold, setHazardScoreThreshold] = useState(cachedData?.hazardScoreThreshold || 70);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [data, setData] = useState(cachedData?.data);
    const [mapFocus, setMapfocus] = useState(cachedData?.mapFocus);
    const [numColors, setNumColors] = useState(cachedData?.numColors || 5);
    const [shade, setShade] = useState(cachedData?.shade || 'Oranges');
    const [colors, setColors] = useState(cachedData?.colors || getColorRange(5, "Oranges", false));
    const [title, setTitle] = useState(cachedData?.title);
    const [height, setHeight] = useState(cachedData?.height || 500);
    const stateView = 285; // need to pull this based on categories
    const category = 'Buildings';

    const options = JSON.stringify({
        filter: {
            ...geoAttribute && {[`substring(${geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]},
            ...JSON.parse(buildingType),
            ...floodPlain && JSON.parse(floodPlain),
        },
    });
    const lenPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'length'];
    const dataPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'databyIndex'];
    const attributes = ['building_id', 'st_asgeojson(st_centroid(footprint)) as building_centroid', `nri_${hazardsMeta[hazard]?.prefix}_eals`];
    const dataSourceByCategoryPath = ['dama', pgEnv, 'sources', 'byCategory', category];
    const attributionPath = ['dama', pgEnv, 'views', 'byId', version, 'attributes'],
        attributionAttributes = ['source_id', 'view_id', 'version', '_modified_timestamp'];

    useEffect(() => {
        async function getData() {
            setLoading(true);
            setStatus(undefined);

            // fetch data sources from categories that match passed prop
            await falcor.get(dataSourceByCategoryPath);
            setDataSources(get(falcor.getCache(), [...dataSourceByCategoryPath, 'value'], []))
            // fetch columns, data

            setLoading(false);

        }

        getData()
    }, []);

    useEffect(() => {
        const geoAttribute =
            (
                dataSources.find(ds => ds.source_id === dataSource)?.metadata?.columns ||
                dataSources.find(ds => ds.source_id === dataSource)?.metadata ||
                [])
                .find(c => c.display === 'geoid-variable');
        geoAttribute?.name && setGeoAttribute(geoAttribute?.name);
    }, [dataSources, dataSource]);

    useEffect(() => {
        async function getData() {
            if (!geoAttribute || !version || !dataSource || !buildingType || !geoid) {
                !buildingType?.length && setStatus('Please select Building Type.');
                !geoAttribute?.length && setStatus('No geo attribute found.');
                !geoid?.length && setStatus('Please select a geography.');
                !version && setStatus('Please select a version.');
                !dataSource && setStatus('Please select a Datasource.');
                setLoading(false);
                return;
            }
            setLoading(true);
            setStatus(undefined);
            // setTitle(metaData.title(hazardsMeta[hazard]?.name, attributes, consequence))
            await falcor.get(lenPath);
            const len = get(falcor.getCache(), lenPath, 0);

            await falcor.get([...dataPath, {from: 0, to: len - 1}, [geoAttribute, ...attributes]]);
            await falcor.get([...attributionPath, attributionAttributes]);

            setLoading(false);

        }

        getData()
    }, [dataSource, version, geoAttribute, geoid, buildingType, floodPlain, hazard]);

    useEffect(() => {
        setData(
            Object.values(get(falcorCache, dataPath, {}))
                .filter(d => typeof d[`nri_${hazardsMeta[hazard]?.prefix}_eals`] !== 'object' && d[`nri_${hazardsMeta[hazard]?.prefix}_eals`] >= hazardScoreThreshold)
        );
    }, [falcorCache, hazardScoreThreshold])
    console.log('data', data)

    useEffect(() => {
        async function getData() {
            if (!geoid || !attributes) {
                !geoid && setStatus('Please Select a Geography.');
                return Promise.resolve();
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);

            const geomColTransform = [`st_asgeojson(st_envelope(ST_Simplify(geom, ${geoid?.length === 5 ? `0.1` : `0.5`})), 9, 1) as geom`],
                geoIndices = {from: 0, to: 0},
                stateFips = get(data, [0, 'geoid']) || geoid?.substring(0, 2),
                geoPath = (view_id) =>
                    ['dama', pgEnv, 'viewsbyId', view_id,
                        'options', JSON.stringify({filter: {geoid: [geoid?.length === 5 ? geoid : stateFips.substring(0, 2)]}}),
                        'databyIndex'
                    ];
            const geomRes = await falcor.get([...geoPath(stateView), geoIndices, geomColTransform]);
            const geom = get(geomRes, ["json", ...geoPath(stateView), 0, geomColTransform]);

            if (geom) {
                setMapfocus(get(JSON.parse(geom), 'bbox'));
            }

            setLoading(false);
        }

        getData()
    }, [geoid]);

    const attributionData = get(falcorCache, attributionPath, {});

    const {geoColors, domain, geoLayer} =
        getGeoColors({geoid, data, columns: [attributes], geoAttribute, colors});

    const geoJson = makeFeatures({data, hazard})

    const layerProps =
        useMemo(() => ({
            ccl: {
                data: (data || [])
                    .map(d => ({
                    building_id: d.building_id,
                    score: d[`nri_${hazardsMeta[hazard]?.prefix}_eals`]
                })),
                dataFormat: d => d,
                idCol: 'building_id',
                geoJson,
                geoColors,
                domain,
                mapFocus,
                colors,
                title,
                attributes,
                geoAttribute,
                dataSource,
                version,
                geoLayer,
                height,
                size,
                change: e => onChange(JSON.stringify({
                    ...e,
                    data,
                    geoJson,
                    geoColors,
                    domain,
                    dataSource,
                    version,
                    geoLayer,
                    geoid,
                    status,
                    attributes,
                    geoAttribute,
                    attributionData,
                    mapFocus,
                    numColors,
                    colors,
                    height,
                    buildingType,
                    floodPlain,
                    hazard
                }))
            }
        }), [geoid, attributes, colors, data, geoColors, height, dataSource, version, geoLayer, buildingType, floodPlain, hazard]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <ButtonSelector
                        label={'Data Source:'}
                        types={dataSources.map(ds => ({label: ds.name, value: ds.source_id}))}
                        type={dataSource}
                        setType={e => {
                            setGeoAttribute(undefined);
                            setVersion(undefined);
                            setData([]);

                            setDataSource(e);
                        }}
                    />
                    <VersionSelectorSearchable
                        source_id={dataSource}
                        view_id={version}
                        onChange={setVersion}
                        className={'flex-row-reverse'}
                    />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>

                    <ButtonSelector
                        label={'Building Type:'}
                        types={[
                            {label: 'State Owned', value: JSON.stringify({value_source: ['ogs']})},
                            {label: 'Critical', value: JSON.stringify({critical: ['not null']})}]}
                        type={buildingType}
                        setType={setBuildingType}
                    />
                    <ButtonSelector
                        label={'Flood Plain:'}
                        types={[
                            {label: '100 Year', value: JSON.stringify({flood_zone: ['AH', 'A', 'VE', 'AO', 'AE']})},
                            {label: '500 Year', value: JSON.stringify({flood_zone: ['X']})}
                        ]}
                        type={floodPlain}
                        setType={setFloodPlain}
                    />

                    <HazardSelectorSimple
                        hazard={hazard}
                        setHazard={setHazard}
                    />

                    <div className={'w-full flex flex-row text-sm'}>
                        <label className={'shrink-0 pr-2 py-2 my-1 w-1/4'}>Threshold:</label>
                        <input
                            key={'pageSizeInput'}
                            className={'p-2 my-1 bg-white rounded-md w-3/4 shrink'}
                            type={"number"}
                            placeholder={'Table Page Size'}
                            value={hazardScoreThreshold}
                            onChange={e => setHazardScoreThreshold(e.target.value)}
                            onWheel={e => e.target.blur()}
                        />
                    </div>

                    <ButtonSelector
                        label={'Size:'}
                        types={[{label: 'Small', value: 500}, {label: 'Medium', value: 700}, {
                            label: 'Large',
                            value: 900
                        }]}
                        type={height}
                        setType={e => {
                            setHeight(e)
                        }}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <React.Fragment>
                                <div className={`flex-none w-full p-1`} style={{height: `${height}px`}}>
                                    <RenderMap
                                        falcor={falcor}
                                        layerProps={layerProps}
                                        legend={{domain, range: colors, title, size, show: false}}
                                        layers={['Circles']}
                                    />
                                </div>
                                <Attribution baseUrl={baseUrl} attributionData={attributionData}/>
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
                        <Attribution baseUrl={baseUrl} attributionData={attributionData}/>
                    </div>
            }
        </div>
    )
}


export default {
    "name": 'Map: Buildings',
    "type": 'Map',
    "EditComp": Edit,
    "ViewComp": View
}