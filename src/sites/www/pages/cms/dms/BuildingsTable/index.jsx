import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderSocialVulnerabilityTable} from "./components/RenderSocialVulnerabilityTable.jsx";
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
    const [fn, setFn] = useState(cachedData?.fn || []);

    const category = 'Buildings';

    const options = JSON.stringify({
        aggregatedLen: Boolean(groupBy.length),
        filter: {...geoAttribute && {[`substring(${geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]}},
        groupBy: groupBy,
        orderBy: [1]
    });
    const lenPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'length'];
    const dataPath = ['dama', pgEnv, 'viewsbyId', version, 'options', options, 'databyIndex'];
    const dataSourceByCategoryPath = ['dama', pgEnv, 'sources', 'byCategory', category];
    const attributionPath = ['dama', pgEnv, 'views', 'byId', version, 'attributes'],
          attributionAttributes = ['source_id', 'view_id', 'version', '_modified_timestamp'];

    const columnsToFetch = visibleCols.map(vc => fn[vc] || vc);

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

            if(!isValid({groupBy, fn, columnsToFetch})){
                setStatus('Please make appropriate grouping selections.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setStatus(undefined);
            await falcor.get(lenPath);
            const len = Math.min(get(falcor.getCache(), lenPath, 0), 1000);

            console.log('data fetching', columnsToFetch.length, [...dataPath, {from: 0, to: len - 1}, columnsToFetch])
            const dataRes = await falcor.get([...dataPath, {from: 0, to: len - 1}, columnsToFetch]);
            console.log('dataRes', get(dataRes, ['json', ...dataPath]))
            await falcor.get([...attributionPath, attributionAttributes]);

            setLoading(false);

        }

        getData()
    }, [dataSource, version, geoid, visibleCols, columnsToFetch, fn, groupBy, geoAttribute]);

    const data = useMemo(() => {
        console.log('?????/', dataPath, columnsToFetch)
            return Object.values(get(falcorCache, dataPath, {}))
                .map(row => columnsToFetch.reduce((acc, ctf) => {
                    acc[ctf] = row[ctf];
                    return acc;
                }, {}))
        },
        [falcorCache, dataPath, fn]);
    const attributionData = get(falcorCache, attributionPath, {});
    console.log('data', data)
    const columns =
        (dataSources.find(ds => ds.source_id === dataSource)?.metadata || [])
        .filter(col => visibleCols.includes(col.name))
        .map(col => {
            return {
                Header: col.name,
                accessor: fn[col.name] || col.name,
                align: col.align || 'right',
                width: col.width || '15%',
                filter: col.filter || filters[col.name],
                ...col
            }
        });

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        attributionData,
                        status,
                        geoid,
                        pageSize, sortBy, groupBy, fn,
                        data, columns, filters, filterValue, visibleCols, geoAttribute,
                        dataSource, dataSources, version
                    }))
            }
        },
        [attributionData, status, geoid, pageSize, sortBy, groupBy, fn,
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
                               .map(c => c.name)
                        }
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
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <RenderSocialVulnerabilityTable
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
                    <RenderSocialVulnerabilityTable {...data} baseUrl={'/'}/>
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