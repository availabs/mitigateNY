import React, {useEffect, useMemo, useState} from "react";
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

const isValid = ({groupBy, fn, columnsToFetch}) => {
    console.log('isValie', groupBy, fn, columnsToFetch,

        columnsToFetch.filter(ctf => !ctf.includes(' as ')).length === groupBy.length,
        columnsToFetch.filter(ctf => ctf.includes(' as ')).length === 0
        )
    if(groupBy.length){
        return columnsToFetch.filter(ctf => !ctf.includes(' as ')).length === groupBy.length
    }else{
        return columnsToFetch.filter(ctf => ctf.includes(' as ')).length === 0
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
    const [fn, setFn] = useState(cachedData?.fn || []);

    const category = 'Buildings';

    const options = JSON.stringify({
        aggregatedLen: Boolean(groupBy.length),
        filter: {
            ...geoAttribute && {[`substring(${geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]},
        },
        exclude: {
            ...notNull.length && notNull.reduce((acc, col) => ({...acc, [col]: ['null']}) , {}) // , '', ' ' error out for numeric columns.
        },
        groupBy: groupBy,
    });
    const lenPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'length'];
    const dataPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'databyIndex'];
    const dataSourceByCategoryPath = ['dama', pgEnv, 'sources', 'byCategory', category];
    const attributionPath = ['dama', pgEnv, 'views', 'byId', version, 'attributes'],
          attributionAttributes = ['source_id', 'view_id', 'version', '_modified_timestamp'];

    // const columnsToFetch = useMemo(() => visibleCols.map(vc => vc), [visibleCols, fn]);

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
        async function getData() {
            if(!visibleCols?.length || !version || !dataSource) {
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
            await falcor.get(lenPath);
            const len = Math.min(get(falcor.getCache(), lenPath, 0), 1000);

            // console.log('data fetching', columnsToFetch.length, [...dataPath, {from: 0, to: len - 1}, visibleCols])
            const dataRes = await falcor.get([...dataPath, {from: 0, to: len - 1}, visibleCols.map(vc => fn[vc] ? fn[vc] : vc)]);
            console.log('dataRes', get(dataRes, ['json', ...dataPath]))
            await falcor.get([...attributionPath, attributionAttributes]);

            setLoading(false);

        }

        getData()
    }, [dataSource, version, geoid, visibleCols, fn, groupBy, notNull, geoAttribute]);

    const data = useMemo(() => {
            return Object.values(get(falcorCache, dataPath, {}))
        },
        [falcorCache, dataPath, fn]);
    const attributionData = get(falcorCache, attributionPath, {});

    const columns =
        (dataSources.find(ds => ds.source_id === dataSource)?.metadata || [])
        .filter(col => visibleCols.includes(col.name))
        .map(col => {
            return {
                Header: col.display_name || col.name,
                accessor: fn[col.name] || col.name,
                align: col.align || 'right',
                width: col.width || '15%',
                filter: col.filter || filters[col.name],
                ...col,
                type: fn[col.name]?.includes('array_to_string') ? 'string' : col.type
            }
        });

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        attributionData,
                        status,
                        geoid,
                        pageSize, sortBy, groupBy, fn, notNull,
                        data, columns, filters, filterValue, visibleCols, geoAttribute,
                        dataSource, dataSources, version
                    }))
            }
        },
        [attributionData, status, geoid, pageSize, sortBy, groupBy, fn, notNull,
            data, columns, filters, filterValue, visibleCols, geoAttribute,
            dataSource, dataSources, version
        ]);

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
                            setVisibleCols([])
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
                    <div className={`flex justify-between`}>
                        <label
                            className={`shrink-0 pr-2 py-1 my-1 w-1/4`}
                        >
                            Geo Attribute:
                        </label>
                        <select
                            className={`bg-white w-full pl-3 rounded-md my-1`}
                            value={geoAttribute}
                            onChange={e => setGeoAttribute(e.target.value)}
                        >
                            <option value={undefined} key={''}>Please select a geography attribute</option>
                            {
                                (dataSources.find(ds => ds.source_id === dataSource)?.metadata || [])
                                    .filter(c => ['geo', 'geoid', 'fips', 'fp']
                                        .reduce((acc, curr) => acc || c.name?.includes(curr), false))
                                    .map(c => <option  value={c.name} key={c.name}>{c.name}</option>)
                            }
                        </select>
                    </div>
                    <RenderColumnControls
                        cols={
                           (dataSources.find(ds => ds.source_id === dataSource)?.metadata || [])
                               .filter(c => c.display?.length)
                               .map(c => c.name)
                        }
                        metadata={dataSources.find(ds => ds.source_id === dataSource)?.metadata || []}
                        // anchorCols={anchorCols}
                        visibleCols={visibleCols}
                        setVisibleCols={setVisibleCols}
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
    "name": 'Table: Buildings',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}