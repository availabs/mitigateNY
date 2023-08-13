import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderNRITable} from "./components/RenderNRITable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {metaData} from "./components/config.js";
import {ButtonSelector} from "../../components/buttonSelector.jsx";

const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [dataSource, setDataSource] = useState(cachedData?.dataSource || 'avail_counties');
    const [dataSourceSRCId, setDataSourceSRCId] = useState(cachedData?.dataSourceSRCId);
    const [dataSourceViewId, setDataSourceViewId] = useState(cachedData?.dataSourceViewId);
    const [typeId, setTypeId] = useState(cachedData?.typeId);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [filterValue, setFilterValue] = useState(cachedData?.filterValue || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || []);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 5);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});
    const [hazard, setHazard] = useState(cachedData?.hazard);

    const countyView = metaData.dataSources.find(d => d.value === dataSource)?.geomView;

    const nriGeoCol = metaData.dataSources.find(d => d.value === dataSource)?.geomCol,
        nriAttributes = metaData.columns(hazard, dataSource),
        anchorCols = [nriAttributes.find(a => a.value === 'stcofips' || a.value === 'tractfips')?.label],
        nriLenOptions =
            JSON.stringify({
                aggregatedLen: false,
                filter: {[`substring(${nriGeoCol}, 1, ${geoid?.length})`]: [geoid]},
            }),
        nriOptions =
            JSON.stringify({
                filter: {[`substring(${nriGeoCol}, 1, ${geoid?.length})`]: [geoid]},
            }),
        nriPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options"];

    const
        geoNamesOptions = JSON.stringify({
            ...geoid && {filter: {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}}
        }),
        geoNamesPath = view_id => ["dama", pgEnv, "viewsbyId", view_id, "options", geoNamesOptions];

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];

    useEffect(() => {
        const ealSourceId = 343;
        const nriSourceId = 159;
        const nriTractsSourceId = 346;

        const dataSourceMapping = {
            avail_counties: ealSourceId,
            nri: nriSourceId,
            nri_tracts: nriTractsSourceId
        }
        setDataSourceSRCId(dataSourceMapping[dataSource]);
    }, [dataSource]);

    useEffect(() => {
        async function setView() {
            setLoading(true)
            if (dataSource === 'avail_counties') {
                const dependencyRes = await falcor.get(dependencyPath(dataSourceViewId));
                const deps = get(dependencyRes, ["json", ...dependencyPath(dataSourceViewId), "dependencies"]);
                const typeId = deps.find(dep => dep.type === 'nri');

                if (!typeId) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }
                setTypeId(typeId.view_id);
            } else {
                setTypeId(dataSourceViewId)
            }
            setLoading(false)
        }

        setView();
    }, [dataSourceSRCId, dataSourceViewId]);

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
                    ...nriAttributes
                        .filter(c => c.filter)
                        .reduce((acc, curr) => ({...acc, [curr.label]: curr.filter}), {})
                }
            )


            if (!typeId) {
                setLoading(false)
                setStatus('This component only supports EAL versions that use nri data.')
                return Promise.resolve();
            }

            const geoNameLenRes = await falcor.get([...geoNamesPath(countyView), "length"]);
            const geoNameLen = get(geoNameLenRes, ["json", ...geoNamesPath(countyView), "length"], 0);

            if (geoNameLen) {
                await falcor.get([...geoNamesPath(countyView), "databyIndex", {
                    from: 0,
                    to: geoNameLen - 1
                }, ["geoid", "namelsad"]]);
            }


            const lenRes = await falcor.get([...nriPath(typeId), nriLenOptions, 'length']);
            const len = Math.min(get(lenRes, ['json', ...nriPath(typeId), nriLenOptions, 'length'], 0), 1000),
                nriIndices = {from: 0, to: len - 1};

            await falcor.get(
                [...nriPath(typeId), nriOptions, 'databyIndex', nriIndices, nriAttributes.map(v => v.value)],
                ['dama', pgEnv, 'views', 'byId', typeId, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']]
            );

            setLoading(false);

        }

        getData()
    }, [geoid, hazard, dataSource, dataSourceSRCId, dataSourceViewId, typeId]);

    const geoNames = Object.values(get(falcorCache, [...geoNamesPath(countyView), "databyIndex"], {}));
    const dataModifier = data => {
        data.map(row => {
            row.stcofips = geoNames?.find(gn => gn.geoid === row.stcofips)?.namelsad || row.stcofips;
        })
        return data
    };
    const data =
        useMemo(() =>
                Object.values(get(falcorCache,
                    [...nriPath(typeId), nriOptions, 'databyIndex'],
                    {})
                ),
            [falcorCache, typeId, nriOptions, nriAttributes, hazard]);
    dataModifier(data);

    const columns =
        [...anchorCols, ...visibleCols]
            .map(c => nriAttributes.find(nriA => nriA.label === c))
            .filter(c => c)
            .map(col => {
                return {
                    Header: col.label,
                    accessor: col.value,
                    align: col.align || 'right',
                    width: col.width || '15%',
                    filter: col.filter || filters[col.label],
                    ...col
                }
            });

    const cols = metaData.columns(hazard);

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', typeId, 'attributes'], {});

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        attributionData,
                        typeId,
                        status,
                        geoid,
                        pageSize, sortBy,
                        data, columns, filters, filterValue, visibleCols, nriAttributes, hazard,
                        dataSource, dataSourceSRCId, dataSourceViewId
                    }))
            }
        },
        [attributionData, status, typeId, geoid, pageSize, sortBy,
            data, columns, filters, filterValue, visibleCols, nriAttributes, hazard,
            dataSource, dataSourceSRCId, dataSourceViewId
        ]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <ButtonSelector
                        label={'Data Source:'}
                        types={metaData.dataSources}
                        type={dataSource}
                        setType={e => {
                            setDataSource(e);
                        }}
                    />
                    <VersionSelectorSearchable
                        source_id={dataSourceSRCId}
                        view_id={dataSourceViewId}
                        onChange={setDataSourceViewId}
                        className={'flex-row-reverse'}
                    />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <HazardSelectorSimple hazard={hazard} setHazard={setHazard}/>
                    <RenderColumnControls
                        cols={nriAttributes.map(a => a.label)}
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
                            <RenderNRITable
                                geoid={geoid}
                                data={data}
                                columns={columns}
                                nriAttributes={nriAttributes}
                                filterValue={filterValue}
                                pageSize={pageSize}
                                sortBy={sortBy}
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
                    <RenderNRITable {...data} baseUrl={'/'}/>
            }
        </div>
    )
}


export default {
    "name": 'Table: NRI',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}