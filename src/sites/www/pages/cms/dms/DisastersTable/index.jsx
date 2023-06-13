import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderDisastersTable} from "./components/RenderDisastersTable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch/index.jsx";
import {Loading} from "~/utils/loading.jsx";
import {ButtonSelector} from "../../components/buttonSelector/index.jsx";
import {RenderColumnControls} from "../../components/columnControls/index.jsx";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    total_fusion_damage: 'Total Loss',
    disaster_number: 'Disaster Number',
    event_id: 'Event Id',
    nri_category: 'Hazard Type',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
    geoid: 'Geoid',
    year: 'Year'
}

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const mapColName = col => colNameMapping[col.includes(' as ') ? col.split(' as ')[1] : col] || col;


const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const [disasterNumbers, setDisasterNumbers] = useState([]);
    const ealSourceId = 343;

    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 692);
    const [fusionViewId, setFusionViewId] = useState(cachedData?.fusionViewId || 657);

    const [loading, setLoading] = useState(true);
    const [type, setType] = useState(cachedData?.type || 'declared');
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || []);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 5);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});

    const fusionGeoCol = `substring(geoid, 1, ${geoid.length})`,
        fusionAttributes = {
            'Geoid': {
                raw: `${fusionGeoCol} as geoid`,
                visible: false
            },
            'Year': {
                raw: 'EXTRACT(YEAR from coalesce(fema_incident_begin_date, swd_begin_date)) as year',
                align: 'right',
                filter: 'text',
                width: '10%'
            },
            [type === 'declared' ? 'Disaster Number' : 'Event Id']: {
                raw: type === 'declared' ? 'disaster_number' : 'event_id',
                align: 'right',
                filter: 'text',
                width: '40%'
            },
            'NRI Category': {
                raw: 'ARRAY_AGG(distinct nri_category order by nri_category) as nri_category',
                align: 'right',
                width: '20%'
            },
            'Deaths, Injuries': {
                raw: "'deaths:' || (coalesce(sum(deaths_direct), 0) + coalesce(sum(deaths_indirect), 0))::text || ', injuries:' || (coalesce(sum(injuries_direct), 0) + coalesce(sum(injuries_indirect), 0))::text as population_damage_numbers"
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
        },
        anchorCols = ['Year', 'Disaster Number', 'Event Id'],
        fusionLenOptions =
            JSON.stringify({
                aggregatedLen: true,
                filter: {
                    [fusionGeoCol]: [geoid],
                    'disaster_number': [type === 'declared' ? 'not null' : 'null']
                },
                groupBy: [fusionGeoCol, 'EXTRACT(YEAR from coalesce(fema_incident_begin_date, swd_begin_date))', type === 'declared' ? 'disaster_number' : 'event_id',],
            }),
        fusionOptions =
            JSON.stringify({
                filter: {[fusionGeoCol]: [geoid], 'disaster_number': [type === 'declared' ? 'not null' : 'null']},
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

    useEffect(() => {
        async function getData() {
            if (!geoid) {
                setStatus('Please Select a Geography');
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            setFilters({...filters,
                ...Object.keys(fusionAttributes)
                    .filter(c => fusionAttributes[c].filter)
                    .reduce((acc, curr) => ({...acc, [curr]: fusionAttributes[curr].filter}), {})}
            )

            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const fusionView = deps.find(d => d.type === "fusion");
                const ddsDeps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"], [])
                    .find(d => d.type === "disaster_declarations_summaries_v2");

                if (!fusionView) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }

                setFusionViewId(fusionView.view_id)

                const lenRes = await falcor.get([...fusionPath(fusionView.view_id), fusionLenOptions, 'length']);
                const len = Math.min(get(lenRes, ['json', ...fusionPath(fusionView.view_id), fusionLenOptions, 'length'], 0), 1000),
                    fusionIndices = {from: 0, to: len - 1};

                const lossRes = await falcor.get(
                    [...fusionPath(fusionView.view_id), fusionOptions, 'databyIndex', fusionIndices, Object.values(fusionAttributes).map(v => v.raw)],
                );

                const disasterNumbers = [...new Set(Object.values(get(lossRes, ['json', ...fusionPath(fusionView.view_id), fusionOptions, 'databyIndex'], {}))
                    .map(d => d.disaster_number)
                    .filter(d => d))];

                if (disasterNumbers.length && ddsDeps) {
                    setDisasterNumbers(disasterNumbers);
                    setDisasterDecView(ddsDeps.view_id);
                    await falcor.get(
                        [...disasterNamePath(ddsDeps.view_id, disasterNumbers), {
                            from: 0,
                            to: disasterNumbers.length - 1
                        }, disasterNameAttributes],
                        ['dama', pgEnv, 'views', 'byId', fusionView.view_id, 'attributes', ['source_id', 'view_id', 'version']]
                    );
                }

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, type]);

    const disasterNames =
        useMemo(() =>
                Object.values(get(falcorCache, [...disasterNamePath(disasterDecView, disasterNumbers)], {})),
            [falcorCache, disasterDecView, disasterNumbers]);
    const data =
        useMemo(() =>
                Object.values(get(falcorCache,
                    [...fusionPath(fusionViewId), fusionOptions, 'databyIndex'],
                    {})
                ),
            // .filter(a => typeof a['year'] !== 'object'),
            [falcorCache, fusionViewId, fusionOptions, fusionAttributes]);

    const columns = Object.keys(fusionAttributes)
        .filter(col => visibleCols.includes(col) || anchorCols.includes(col))
        .map(col => {
            return {
                Header: col,
                accessor: fusionAttributes[col].raw,
                rawHeader: fusionAttributes[col].raw,
                align: fusionAttributes[col].align || 'left',
                width: fusionAttributes[col].width || '15%',
                filter: fusionAttributes[col].filter || filters[col]
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
                        type, data, columns, filters, visibleCols, fusionAttributes, disasterNames
                    }))
            }
        },
        [attributionData, status, ealViewId, fusionViewId, geoid, pageSize, sortBy,
            type, data, columns, filters, visibleCols, fusionAttributes, disasterNames]);

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
                    <RenderColumnControls
                        cols={Object.keys(fusionAttributes || {}).filter(c => fusionAttributes[c].visible !== false)}
                        anchorCols={anchorCols}
                        visibleCols={visibleCols}
                        setVisibleCols={setVisibleCols}
                        filters={filters}
                        setFilters={setFilters}
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
                                fusionAttributes={fusionAttributes}
                                disasterNames={disasterNames}
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