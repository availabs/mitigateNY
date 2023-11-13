import React, {useCallback, useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderBuildingsTable} from "./components/RenderBuildingsTable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import {addTotalRow} from "../../utils/addTotalRow.js";

const isValid = ({groupBy, fn, columnsToFetch}) => {
    const fns = columnsToFetch.map(ctf => ctf.includes(' AS') ? ctf.split(' AS')[0] : ctf.split(' as')[0]);

    if(groupBy.length){
        return fns.filter(ctf =>
            !ctf.includes('sum(') &&
            !ctf.includes('array_to_string') &&
            !ctf.includes('count(')
        ).length === groupBy.length
    }else{
        return fns.filter(ctf =>
            ctf.includes('sum(') ||
            ctf.includes('array_to_string') ||
            ctf.includes('count(')
        ).length === 0
    }
}

const parseJson = str => {
    try {
        return JSON.parse(str);
    }catch (e){
        return {}
    }
}

async function getMeta({dataSources, dataSource, visibleCols, geoid}, falcor){
    const metadata = dataSources.find(ds => ds.source_id === dataSource)?.metadata?.columns;
    const metaViewIdLookupCols =
        metadata?.filter(md => visibleCols.includes(md.name) && ['meta-variable', 'geoid-variable'].includes(md.display) && md.meta_lookup);

    if(metaViewIdLookupCols?.length){
        const data =
            await metaViewIdLookupCols
                .filter(md => parseJson(md.meta_lookup)?.view_id)
                .reduce(async (acc, md) => {
                    const prev = await acc;
                    const metaLookup = parseJson(md.meta_lookup);
                    const options = JSON.stringify({
                        aggregatedLen: metaLookup.aggregatedLen,
                        filter: {
                            ...metaLookup?.geoAttribute && {[`substring(${metaLookup.geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]},
                            ...(metaLookup?.filter || {})
                        }
                    });
                    const attributes = metaLookup.attributes;
                    const keyAttribute = metaLookup.keyAttribute;

                    const lenPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'length'];

                    const lenRes = await falcor.get(lenPath);
                    const len = get(lenRes, ['json', ...lenPath], 0);

                    if(!len) return Promise.resolve();

                    const dataPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'databyIndex'];
                    const dataRes = await falcor.get([...dataPath, {from: 0, to: len - 1}, attributes]);
                    const data = Object.values(get(dataRes, ['json', ...dataPath], {}))
                        .reduce((acc, d) => (
                            {
                                ...acc,
                                ...{[d[keyAttribute]]: {...attributes.reduce((acc, attr) => ({...acc, ...{[attr]: d[attr]}}), {})}}
                            }
                        ), {})

                    return {...prev, ...{[md.name]: data}};
                }, {});
        // setMetaLookupByViewId(data)
        return data;
    }
    return {}
}

const assignMeta = ({
                        metadata,
                        visibleCols,
                        dataPath,
                        options,
                        groupBy,
                        fn,
                        notNull,
                        geoAttribute,
                        geoid,
                        metaLookupByViewId
                    }, falcor) => {
    const falcorCache = falcor.getCache();

    const metaLookupCols =
        metadata?.filter(md =>
            visibleCols.includes(md.name) &&
            ['meta-variable', 'geoid-variable'].includes(md.display)
        );

    if(metaLookupCols?.length){
        return Object.values(get(falcorCache, dataPath(options({groupBy, notNull, geoAttribute, geoid})), {}))
            .map(row => {
                metaLookupCols.forEach(mdC => {
                    const currentMetaLookup = parseJson(mdC.meta_lookup);
                    const currentColName = fn[mdC.name] || mdC.name;
                    if(currentMetaLookup?.view_id){
                        const currentViewIdLookup = metaLookupByViewId[mdC.name] || [];
                        const currentKeys = row[currentColName];
                        if(currentKeys?.includes(',')){
                            row[currentColName] = currentKeys.split(',').map(ck => currentViewIdLookup[ck.trim()]?.name || ck.trim()).join(', ')
                        }else{
                            row[currentColName] = currentViewIdLookup[currentKeys]?.name || currentKeys;
                        }
                    }else{
                        row[currentColName] = currentMetaLookup[row[currentColName]] || row[currentColName];
                    }
                })
                return row;
            })
    }

    return Object.values(get(falcorCache, dataPath(options({groupBy, notNull, geoAttribute, geoid})), {}))

}

async function getData({
                           dataSources, dataSource, geoAttribute,
                           geoid,
                           pageSize, sortBy, groupBy, fn, notNull, showTotal, colSizes,
                           filters, filterValue, visibleCols, hiddenCols,
                           version
                       }, falcor) {
    const options = ({groupBy, notNull, geoAttribute, geoid}) => JSON.stringify({
        aggregatedLen: Boolean(groupBy.length),
        filter: {
            ...geoAttribute && {[`substring(${geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]},
        },
        exclude: {
            ...notNull.length && notNull.reduce((acc, col) => ({...acc, [col]: ['null']}) , {}) // , '', ' ' error out for numeric columns.
        },
        groupBy: groupBy,
    });

    const lenPath = options => ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'length'];
    const dataPath = options => ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'databyIndex'];
    const attributionPath = ['dama', pgEnv, 'views', 'byId', version, 'attributes'],
        attributionAttributes = ['source_id', 'view_id', 'version', '_modified_timestamp'];

    const metadata = dataSources.find(ds => ds.source_id === dataSource)?.metadata?.columns ||
                     dataSources.find(ds => ds.source_id === dataSource)?.metadata ||
                     [];

    await falcor.get(lenPath(options({groupBy, notNull, geoAttribute, geoid})));
    const len = Math.min(
        get(falcor.getCache(), lenPath(options({groupBy, notNull, geoAttribute, geoid})), 0),
        590);

    await falcor.get(
        [...dataPath(options({groupBy, notNull, geoAttribute, geoid})),
            {from: 0, to: len - 1}, visibleCols.map(vc => fn[vc] ? fn[vc] : vc)]);

    await falcor.get([...attributionPath, attributionAttributes]);

    const metaLookupByViewId = await getMeta({dataSources, dataSource, visibleCols, geoid}, falcor);

    const data = assignMeta({
        metadata,
        visibleCols,
        dataPath,
        options,
        groupBy,
        fn,
        notNull,
        geoAttribute,
        geoid,
        metaLookupByViewId
    }, falcor);

    const columns = visibleCols
        .map(c => metadata.find(md => md.name === c))
        .filter(c => c && !hiddenCols.includes(c.name))
        .map(col => {
            return {
                Header: col.display_name || col.name,
                accessor: fn[col.name] || col.name,
                align: col.align || 'right',
                width: colSizes[col.name] || '15%',
                filter: col.filter || filters[col.name],
                info: col.desc,
                ...col,
                type: fn[col.name]?.includes('array_to_string') ? 'string' : col.type
            }
        })

    addTotalRow({showTotal, data, columns, setLoading: () => {}});

    const attributionData =  get(falcor.getCache(), attributionPath, {});

    return {
        attributionData,
        geoid,
        pageSize, sortBy, groupBy, fn, notNull, showTotal, colSizes,
        data, columns, filters, filterValue, visibleCols, hiddenCols, geoAttribute,
        dataSource, dataSources, version
    }
}


const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [dataSources, setDataSources] = useState(cachedData?.dataSources || []);
    const [dataSource, setDataSource] = useState(cachedData?.dataSource);
    const [version, setVersion] = useState(cachedData?.version);
    const [geoAttribute, setGeoAttribute] = useState(cachedData?.geoAttribute);

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [filterValue, setFilterValue] = useState(cachedData?.filterValue || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || []);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 5);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});
    const [groupBy, setGroupBy] = useState(cachedData?.groupBy || []);
    const [notNull, setNotNull] = useState(cachedData?.notNull || []);
    const [showTotal, setShowTotal] = useState(cachedData?.showTotal || []);
    const [fn, setFn] = useState(cachedData?.fn || []);
    const [hiddenCols, setHiddenCols] = useState(cachedData?.hiddenCols || []);
    const [colSizes, setColSizes] = useState(cachedData?.colSizes || {});

    const category = 'Cenrep';

    const dataSourceByCategoryPath = ['dama', pgEnv, 'sources', 'byCategory', category];

    useEffect(() => {
        async function getData() {
            setLoading(true);
            setStatus(undefined);

            // fetch data sources from categories that match passed prop
            await falcor.get(dataSourceByCategoryPath);
            setDataSources(get(falcor.getCache(), [...dataSourceByCategoryPath, 'value'], []))

            setLoading(false);

        }

        getData()
    }, []);

    useEffect(() => {
        const geoAttribute =
            (dataSources
                .find(ds => ds.source_id === dataSource)?.metadata?.columns || [])
                .find(c => c.display === 'geoid-variable');
        geoAttribute?.name && setGeoAttribute(geoAttribute?.name);
    }, [dataSources, dataSource]);



    useEffect(() => {
        async function load(){
            if(dataSources && (!visibleCols?.length || !version || !dataSource)) {
                !dataSource && setStatus('Please select a Datasource.');
                !version && setStatus('Please select a version.');
                !visibleCols?.length && setStatus('Please select columns.');

                setLoading(false);
                return;
            }

            if(!isValid({groupBy, fn, columnsToFetch: visibleCols.map(vc => fn[vc] ? fn[vc] : vc)})){
                setStatus('Please make appropriate grouping selections.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setStatus(undefined);

            const data = await getData({
                dataSources, dataSource, geoAttribute, geoid,
                pageSize, sortBy, groupBy, fn, notNull, showTotal, colSizes,
                filters, filterValue, visibleCols, hiddenCols,
                version
            }, falcor);

            onChange(JSON.stringify({
                ...data,
            }));

            setLoading(false);

        }

        load()
    }, [dataSources, dataSource, geoid, geoAttribute,
        pageSize, sortBy, groupBy, fn, notNull, showTotal, colSizes,
        filters, filterValue, visibleCols, hiddenCols,
        version
    ]);

    const data = cachedData.data;

    const attributionData = cachedData.attributionData;

    const columns = cachedData.columns;

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <div className={`flex justify-between`}>
                        <label
                            className={`shrink-0 pr-2 py-1 my-1 w-1/4`}
                        >
                            Data Source:
                        </label>
                        <select
                            className={`bg-white w-full pl-3 rounded-md my-1`}
                            value={dataSource}
                            onChange={e => {
                                setVisibleCols([])
                                setDataSource(+e.target.value);
                            } }
                        >
                            <option key={'undefined'} value={undefined} selected disabled>Please select a data source</option>
                            {
                                dataSources.map(ds => <option key={ds.source_id} value={ds.source_id}> {ds.name} </option>)
                            }
                        </select>
                    </div>
                    <VersionSelectorSearchable
                        source_id={dataSource}
                        view_id={version}
                        onChange={setVersion}
                        className={'flex-row-reverse'}
                    />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>

                    <RenderColumnControls
                        cols={
                           (dataSources.find(ds => ds.source_id === dataSource)?.metadata?.columns || [])
                               .filter(c => ['data-variable', 'meta-variable', 'geoid-variable'].includes(c.display))
                               .map(c => c.name)
                        }
                        metadata={dataSources.find(ds => ds.source_id === dataSource)?.metadata?.columns || []}
                        // anchorCols={anchorCols}
                        visibleCols={visibleCols}
                        setVisibleCols={setVisibleCols}
                        hiddenCols={hiddenCols}
                        setHiddenCols={setHiddenCols}
                        filters={filters}
                        setFilters={setFilters}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        groupBy={groupBy}
                        setGroupBy={setGroupBy}
                        fn={fn}
                        setFn={setFn}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        notNull={notNull}
                        setNotNull={setNotNull}
                        showTotal={showTotal}
                        setShowTotal={setShowTotal}
                        colSizes={colSizes}
                        setColSizes={setColSizes}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <RenderBuildingsTable
                                geoid={geoid}
                                data={data}
                                columns={columns}
                                filterValue={filterValue}
                                pageSize={pageSize}
                                sortBy={sortBy}
                                attributionData={attributionData}
                                baseUrl={baseUrl}
                                // fetchData={fetchData}
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
                    <RenderBuildingsTable {...data} baseUrl={'/'}/>
            }
        </div>
    )
}


export default {
    "name": 'Table: Cenrep',
    "type": 'Table',
    "variables": [
        {
            name: 'dataSources',
            hidden: true
        },
        {
            name: 'dataSource',
            hidden: true
        },
        {
            name: 'version',
            hidden: true
        },
        {
            name: 'geoAttribute',
            hidden: true
        },
        {
            name: 'geoid',
            default: '36',
            hidden: true
        },
        {
            name: 'pageSize',
            hidden: true
        },
        {
            name: 'sortBy',
            hidden: true
        },
        {
            name: 'groupBy',
            hidden: true
        },
        {
            name: 'fn',
            hidden: true
        },
        {
            name: 'notNull',
            hidden: true
        },
        {
            name: 'showTotal',
            hidden: true
        },
        {
            name: 'colSizes',
            hidden: true
        },
        {
            name: 'filters',
            hidden: true
        },
        {
            name: 'filterValue',
            hidden: true
        },
        {
            name: 'visibleCols',
            hidden: true
        },
        {
            name: 'hiddenCols',
            hidden: true
        },
    ],
    getData,
    "EditComp": Edit,
    "ViewComp": View
}