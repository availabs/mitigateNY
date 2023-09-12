import React, {useCallback, useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {ActionsTable} from "./components/ActionsTable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {HazardSelectorSimple} from "../../components/HazardSelector/hazardSelectorSimple.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import actionsConfig from "~/sites/www/pages/admin/forms/actions/actions.format.js";
import {dmsDataLoader} from "~/modules/dms/src";
import {getMeta, setMeta} from "./utils.js";
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

const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';
    const [data, setData] = useState(cachedData?.data || []);
    const [geoAttribute, setGeoAttribute] = useState(cachedData?.geoAttribute);
    const [metaLookupByViewId, setMetaLookupByViewId] = useState({}); // not caching
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
    const [actionType, setActionType] = useState(cachedData?.actionType || 'shmp')

    useEffect(() => {
        const geoAttribute = actionsConfig.attributes.find(c => c.geoVariable);
        geoAttribute?.key && setGeoAttribute(geoAttribute?.key);
    }, []);

    useEffect(() => {
        getMeta({
            actionsConfig,
            metaLookupByViewId,
            setMetaLookupByViewId,
            visibleCols,
            pgEnv,
            falcor,
            geoid});
    }, [geoid, visibleCols]);

    useEffect(() => {
        // gets 250 rows
        async function getData() {
            if(!visibleCols?.length ) {
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

            const d = await dmsDataLoader(
                {
                    format: actionsConfig,
                    children: [
                        {
                            type: () => {},
                            action: 'load',
                            path: '/0/250',
                            filter: {
                                fromIndex: path => path.split('/')[1],
                                toIndex: path => path.split('/')[2],
                                options: JSON.stringify({
                                    filter: {[`data->>'idKey'`]: [actionType]}
                                })
                            },
                        }
                    ]
                },
                '/0/250'
            );

            await setMeta({
                actionsConfig,
                visibleCols,
                data: d,
                setData,
                metaLookupByViewId,
                geoAttribute, geoid, actionType
            })

            setLoading(false);
        }

        getData()
    }, [geoid, visibleCols, fn, groupBy, notNull, geoAttribute, metaLookupByViewId]);


    // const attributionData = get(falcorCache, attributionPath, {});

    const columns =
        visibleCols
            .map(c => actionsConfig.attributes.find(md => md.label === c))
            .filter(c => c)
            .map(col => {
                return {
                    Header: col.label,
                    accessor: col.key,
                    align: col.align || 'right',
                    width: col.width || '15%',
                    filter: col.filter || filters[col.label],
                    info: col.desc,
                    ...col,
                    type: fn[col.label]?.includes('array_to_string') ? 'string' : col.type
                }
            });

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        status,
                        geoid,
                        pageSize, sortBy, groupBy, fn, notNull,
                        data, columns, filters, filterValue, visibleCols, geoAttribute, actionType
                    }))
            }
        },
        [ status, geoid, pageSize, sortBy, groupBy, fn, notNull,
            data, columns, filters, filterValue, visibleCols, geoAttribute, actionType
        ]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>

                    <RenderColumnControls
                        cols={actionsConfig.attributes.map(c => c.label)}
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
                            <ActionsTable
                                geoid={geoid}
                                data={data}
                                columns={columns}
                                filterValue={filterValue}
                                pageSize={pageSize}
                                sortBy={sortBy}
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
                    <ActionsTable {...data} baseUrl={'/'}/>
            }
        </div>
    )
}


export default {
    "name": 'Table: Actions',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}