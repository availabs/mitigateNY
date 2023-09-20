import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderDisastersTable} from "./components/RenderDisastersTable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {hazardsMeta} from "../../../../../../utils/colors.jsx";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    total_fusion_damage: 'Total Loss',
    disaster_number: 'Disaster Name / Number',
    event_id: 'Event Id',
    nri_category: 'Hazard Type',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
    county: 'County',
    year: 'Year'
}

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const getNestedValue = (obj) => typeof obj?.value === 'object' ? getNestedValue(obj.value) : obj?.value || obj;


const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 343;

    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 818);
    const [fusionViewId, setFusionViewId] = useState(cachedData?.fusionViewId || 813);
    const [countyView, setCountyView] = useState(cachedData?.countyView);
    const [disasterDecView, setDisasterDecView] = useState(cachedData?.disasterDecView);
    const [disasterNumbers, setDisasterNumbers] = useState(cachedData?.disasterNumbers || []);
    const [nceiEView, setNceiEView] = useState(cachedData?.nceiEView);
    const [eventIds, setEventIds] = useState(cachedData?.eventIds || []);

    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(cachedData?.type || 'declared');
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [filterValue, setFilterValue] = useState(cachedData?.filterValue || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || []);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 5);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});
    const [hazard, setHazard] = useState(cachedData?.hazard || 'total');

    const fusionGeoCol = 'geoid',
        fusionAttributes = {
            [type === 'declared' ? 'Disaster Name / Number' : 'Event Id']: {
                raw: type === 'declared' ? 'disaster_number' : 'event_id',
                align: 'right',
                // filter: 'text',
                width: [type === 'declared' ? '40%' : '10%'],
                type: 'text'
            },
            'County': {
                raw: `geoid`,
                type: 'text'
            },
            'Year': {
                raw: 'EXTRACT(YEAR from coalesce(fema_incident_begin_date, swd_begin_date)) as year',
                align: 'right',
                // filter: 'text',
                width: '10%',
                type: 'text'
            },
            'NRI Category': {
                raw: 'ARRAY_AGG(distinct nri_category order by nri_category) as nri_category',
                align: 'right',
                width: '20%',
                type: 'text'
            },
            'Start Date': {
                raw: "min(coalesce(fema_incident_begin_date, swd_begin_date)) as start_date",
                type: 'text'
            },
            'Deaths, Injuries': {
                raw: "'deaths:' || (coalesce(sum(deaths_direct), 0) + coalesce(sum(deaths_indirect), 0))::text || ', injuries:' || (coalesce(sum(injuries_direct), 0) + coalesce(sum(injuries_indirect), 0))::text as population_damage_numbers",
                type: 'text'
            },
            'Population Damage $': {
                raw: 'sum(swd_population_damage) * 11700000 as swd_population_damage',
                align: 'right',
            },
            'Property Damage': {
                raw: 'sum(fusion_property_damage) as fusion_property_damage',
                align: 'right',
            },
            'Crop Damage': {
                raw: 'sum(fusion_crop_damage) as fusion_crop_damage',
                align: 'right',
            },
            'Total Damage': {
                raw: 'coalesce(sum(fusion_property_damage), 0) + coalesce(sum(fusion_crop_damage), 0) as total_fusion_damage',
                width: '20%',
                align: 'right',
            },
            'Event Narrative': {
                raw: 'event_narrative',
                width: '20%',
                align: 'right',
                fetchData: false,
                type: 'text',
                visible: false
            },
            'Episode Narrative': {
                raw: 'episode_narrative',
                width: '20%',
                align: 'right',
                fetchData: false,
                type: 'text',
                visible: false
            },
        },
        anchorCols = [],
        fusionLenOptions =
            JSON.stringify({
                aggregatedLen: true,
                filter: {
                    [`substring(${fusionGeoCol}, 1, ${geoid.length})`]: [geoid],
                    ...type !== 'declared' && {'disaster_number': ['null']},
                    ...hazard !== 'total' && {nri_category: [hazard]}
                },
                exclude: {
                    ...type === 'declared' &&
                    {'coalesce((fusion_property_damage), 0) + coalesce((fusion_crop_damage), 0)+ coalesce((swd_population_damage), 0)': [0]},
                    ...type === 'declared' && {'disaster_number': ['null']}
                },
                groupBy: [fusionGeoCol, 'EXTRACT(YEAR from coalesce(fema_incident_begin_date, swd_begin_date))', type === 'declared' ? 'disaster_number' : 'event_id',],
            }),
        fusionOptions =
            JSON.stringify({
                filter: {
                    [`substring(${fusionGeoCol}, 1, ${geoid.length})`]: [geoid],
                    ...type !== 'declared' && {'disaster_number': ['null']},
                    ...hazard !== 'total' && {nri_category: [hazard]}
                },
                exclude: {
                    ...type === 'declared' &&
                    {'coalesce((fusion_property_damage), 0) + coalesce((fusion_crop_damage), 0)+ coalesce((swd_population_damage), 0)': [0]},
                    ...type === 'declared' && {'disaster_number': ['null']}
                },
                groupBy: [1, 2, 3],
                orderBy: [
                    type === 'declared' ?
                        'sum(fema_property_damage)+sum(fema_crop_damage) desc nulls last' :
                        'sum(swd_property_damage)+sum(swd_crop_damage)+sum(swd_population_damage) desc nulls last']
            }),
        fusionPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options"];
    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];

    const disasterNameAttributes = ['distinct disaster_number as disaster_number', 'declaration_title'],
        disasterNamePath = (view_id, disasterNumbers) =>
            ['dama', pgEnv, "viewsbyId", view_id,
                "options", JSON.stringify({filter: {disaster_number: disasterNumbers}}),
                'databyIndex'];

    const eventDescriptionAttributes = ['event_id', 'event_narrative', 'episode_narrative'],
        eventDescriptionPath = (view_id, eventIds) =>
            ['dama', pgEnv, "viewsbyId", view_id,
                "options", JSON.stringify({filter: {event_id: eventIds}}),
                'databyIndex'];

    const
        geoNamesOptions = JSON.stringify({
            ...geoid && {filter: {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}}
        }),
        geoNamesPath = view_id => ["dama", pgEnv, "viewsbyId", view_id, "options", geoNamesOptions];

    useEffect(() => {
        async function getData() {
            if (!geoid) {
                setStatus('Please Select a Geography');
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            setFilters({
                    ...filters,
                    ...Object.keys(fusionAttributes)
                        .filter(c => fusionAttributes[c].filter)
                        .reduce((acc, curr) => ({...acc, [curr]: fusionAttributes[curr].filter}), {})
                }
            )

            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const fusionView = deps.find(d => d.type === "fusion");
                const ddsDeps = deps.find(d => d.type === "disaster_declarations_summaries_v2");
                const countyView = deps.find(dep => dep.type === "tl_county");
                const nceiEView = deps.find(dep => dep.type === "ncei_storm_events_enhanced");

                if (!fusionView) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setFusionViewId(fusionView.view_id);
                setCountyView(countyView.view_id);

                const geoNameLenRes = await falcor.get([...geoNamesPath(countyView.view_id), "length"]);
                const geoNameLen = get(geoNameLenRes, ["json", ...geoNamesPath(countyView.view_id), "length"], 0);

                if (geoNameLen) {
                    await falcor.get([...geoNamesPath(countyView.view_id), "databyIndex", {
                        from: 0,
                        to: geoNameLen - 1
                    }, ["geoid", "namelsad"]]);
                }

                const lenRes = await falcor.get([...fusionPath(fusionView.view_id), fusionLenOptions, 'length']);
                const len =
                        Math.min(get(lenRes,
                            ['json', ...fusionPath(fusionView.view_id), fusionLenOptions, 'length'], 0), 250),
                    fusionIndices = {from: 0, to: len - 1};

                const lossRes = await falcor.get(
                    [...fusionPath(fusionView.view_id),
                        fusionOptions, 'databyIndex', fusionIndices,
                        Object.values(fusionAttributes)
                            .filter(v => v.fetchData !== false)
                            .map(v => v.raw)
                    ],
                    ['dama', pgEnv, 'views', 'byId',
                        fusionView.view_id, 'attributes',
                        ['source_id', 'view_id', 'version', '_modified_timestamp']
                    ]
                );

                const disasterNumbers =
                    [...new Set(Object.values(
                        get(lossRes, ['json', ...fusionPath(fusionView.view_id), fusionOptions, 'databyIndex'], {}))
                    .map(d => d.disaster_number)
                    .filter(d => d))];

                const eventIds =
                    [...new Set(Object.values(
                        get(lossRes, ['json', ...fusionPath(fusionView.view_id), fusionOptions, 'databyIndex'], {}))
                    .map(d => d.event_id)
                    .filter(d => d))];

                if (disasterNumbers.length && ddsDeps) {
                    setDisasterNumbers(disasterNumbers);
                    setDisasterDecView(ddsDeps.view_id);
                    await falcor.get(
                        [...disasterNamePath(ddsDeps.view_id, disasterNumbers), {
                            from: 0,
                            to: disasterNumbers.length - 1
                        }, disasterNameAttributes],
                    );
                }

                if (eventIds.length && nceiEView) {
                    setEventIds(eventIds);
                    setNceiEView(nceiEView.view_id);
                    await falcor.get(
                        [...eventDescriptionPath(nceiEView.view_id, eventIds), {
                            from: 0,
                            to: eventIds.length - 1
                        }, eventDescriptionAttributes],
                    );
                }

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, type, hazard]);

    const disasterNames =
        useMemo(() =>
                Object.values(get(falcorCache, [...disasterNamePath(disasterDecView, disasterNumbers)], {})),
            [falcorCache, disasterDecView, disasterNumbers, hazard]);

    const eventDesc =
        useMemo(() =>
                Object.values(get(falcorCache, [...eventDescriptionPath(nceiEView, eventIds)], {})),
            [falcorCache, nceiEView, eventIds, hazard]);

    const geoNames = Object.values(get(falcorCache, [...geoNamesPath(countyView), "databyIndex"], {}));
    const dataModifier = data => useMemo(() =>
        data.map(row => {
            const newRow = {...row};
            const nriCategories = getNestedValue(newRow[fusionAttributes["NRI Category"].raw]);

            newRow[fusionAttributes.County.raw] = geoNames?.find(gn => gn.geoid === newRow[fusionAttributes.County.raw])?.namelsad || newRow[fusionAttributes.County.raw];
            newRow[fusionAttributes["NRI Category"].raw] = (nriCategories || []).map(h => hazardsMeta[h]?.name || h).join(', ')

            if(type === 'declared' && newRow[fusionAttributes['Disaster Name / Number'].raw]?.length <= 4) {
                newRow[fusionAttributes['Disaster Name / Number'].raw] =
                    get(disasterNames.find(dns => dns[colAccessNameMapping.disaster_number] === newRow[fusionAttributes['Disaster Name / Number'].raw]),
                        "declaration_title",
                        "No Title") + ` (${newRow[fusionAttributes['Disaster Name / Number'].raw]})`;
            }

            if(type === 'non-declared' && !(newRow.event_narrative || newRow.episode_narrative)){
                const eventDescRecord = eventDesc.find(e => e.event_id === newRow.event_id);
                if(visibleCols.includes('Event Narrative') || visibleCols.includes('Episode Narrative')){
                    newRow.expand = [];
                    visibleCols.includes('Event Narrative') && newRow.expand.push({key: 'Event Narrative', value: eventDescRecord?.event_narrative});
                    visibleCols.includes('Episode Narrative') && newRow.expand.push({key: 'Episode Narrative', value: eventDescRecord?.episode_narrative});
                }
            }
            return newRow;
        })
    , [data, visibleCols]);

    const originalData =
        useMemo(() =>
                Object.values(get(falcorCache,
                    [...fusionPath(fusionViewId), fusionOptions, 'databyIndex'],
                    {})),
            [falcorCache, fusionViewId, fusionOptions, fusionAttributes, hazard, filterValue]);
    const data = dataModifier(originalData);

    const columns =
        [...anchorCols, ...visibleCols]
            .filter(c => fusionAttributes[c] && fusionAttributes[c]?.visible !== false)
            .map(col => {
                return {
                    Header: col,
                    accessor: fusionAttributes[col]?.raw,
                    rawHeader: fusionAttributes[col]?.raw,
                    type: fusionAttributes[col]?.type,
                    align: fusionAttributes[col]?.align || 'left',
                    width: fusionAttributes[col]?.width || '15%',
                    filter: fusionAttributes[col]?.filter || filters[col],
                }
            });


    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes'], {});

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        attributionData,
                        ealViewId,
                        fusionViewId,
                        status,
                        geoid,
                        pageSize, sortBy,
                        type, originalData, data,
                        columns, filters, filterValue, visibleCols,
                        fusionAttributes, disasterNames, eventIds, hazard
                    }))
            }
        },
        [attributionData, status, ealViewId, fusionViewId, geoid, pageSize, sortBy,
            type, originalData, data, columns, filters, filterValue, visibleCols, fusionAttributes,
            disasterNames, eventIds, hazard]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId}
                                               className={'flex-row-reverse'}/>
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <ButtonSelector
                        label={'Type:'}
                        types={[
                            {label: 'Declared Disasters', value: 'declared'},
                            {label: 'Non Declared Disasters', value: 'non-declared'}]}
                        type={type}
                        setType={e => {
                            setType(e)
                            setVisibleCols([])
                            setFilters({})
                        }}
                    />
                    <HazardSelectorSimple hazard={hazard} setHazard={setHazard} showTotal={true}/>
                    <RenderColumnControls
                        cols={Object.keys(fusionAttributes || {})}
                        anchorCols={anchorCols}
                        visibleCols={visibleCols}
                        setVisibleCols={setVisibleCols}
                        filters={filters}
                        setFilters={setFilters}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <RenderDisastersTable
                                geoid={geoid}
                                type={type}
                                data={data}
                                columns={columns}
                                pageSize={pageSize}
                                sortBy={sortBy}
                                filterValue={filterValue}
                                fusionAttributes={fusionAttributes}
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
    if (!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] :
        JSON.parse(value)
    return (
        <div className='relative w-full p-6'>
            {
                data?.status ?
                    <div className={'p-5 text-center'}>{data?.status}</div> :
                    <RenderDisastersTable {...data} baseUrl={'/'}/>
            }
        </div>
    )
}


export default {
    "name": 'Table: Disaster Events',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}