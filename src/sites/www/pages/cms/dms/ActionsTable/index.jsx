import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {ActionsTable} from "./components/ActionsTable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import {dmsDataLoader} from "~/modules/dms/src";
import {getMeta, setMeta, getAccessor, getColAccessor, defaultOpenOutAttributes} from "./utils.js";
import {formsConfigFormat} from "../../../forms/index.jsx";

const isValid = ({groupBy, fn, columnsToFetch}) => {
    const fns = columnsToFetch.map(ctf => ctf.includes(' AS') ? ctf.split(' AS')[0] : ctf.split(' as')[0]);

    if (groupBy.length) {
        return fns.filter(ctf =>
            !ctf.includes('sum(') &&
            !ctf.includes('array_to_string') &&
            !ctf.includes('count(')
        ).length === groupBy.length
    } else {
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
    const [actionsConfig, setActionsConfig] = useState()
    const [hiddenCols, setHiddenCols] = useState(cachedData?.hiddenCols || []);
    const [colSizes, setColSizes] = useState(cachedData?.colSizes || {});

    useEffect(() => {
        async function getActionsConfig() {
            const formConfigs = await dmsDataLoader(
                {
                    format: formsConfigFormat,
                    children: [
                        {
                            type: () => {
                            },
                            action: 'list',
                            path: '/',
                        }
                    ]
                }, '/');
            const config = formConfigs.find(fc => fc.name === 'Actions')?.config;
            if(config) setActionsConfig(JSON.parse(config));
        }

        getActionsConfig();
    }, [])

    useEffect(() => {
        if (!actionsConfig) return;
        const geoAttribute = actionsConfig.attributes.find(c => c.geoVariable);
        geoAttribute?.name && setGeoAttribute(geoAttribute?.name);
    }, []);

    useEffect(() => {
        if (!actionsConfig) return;
        getMeta({
            actionsConfig,
            metaLookupByViewId,
            setMetaLookupByViewId,
            visibleCols,
            pgEnv,
            falcor,
            geoid
        });
    }, [actionsConfig, geoid, visibleCols]);

    useEffect(() => {
        if (!actionsConfig) return;

        // gets 250 rows
        async function getData() {
            if (!visibleCols?.length) {
                !visibleCols?.length && setStatus('Please select columns.');

                setLoading(false);
                return;
            }

            if (!isValid({groupBy, fn, columnsToFetch: visibleCols.map(vc => fn[vc] ? fn[vc] : vc)})) {
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
                            type: () => {
                            },
                            action: 'load',
                            path: '/0/250',
                            filter: {
                                // fromIndex: path => path.split('/')[1],
                                // toIndex: path => path.split('/')[2],
                                options: JSON.stringify({
                                    aggregatedLen: groupBy?.length,
                                    filter: {[`data->>'idKey'`]: [actionType]},
                                    exclude: {
                                        ...notNull.length &&
                                        notNull.reduce((acc, col) => ({...acc, [`data->>'${col}'`]: ['null']}) , {}) // , '', ' ' error out for numeric columns.
                                    },
                                    groupBy: groupBy.map(gb => `${getAccessor(gb)}'${gb}'`)
                                }),
                                attributes: visibleCols.map(vc => getColAccessor(fn, vc))
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
                geoAttribute, geoid, actionType, fn
            })

            setLoading(false);
        }

        getData()
    }, [actionsConfig, geoid, visibleCols, fn, groupBy, notNull, geoAttribute, metaLookupByViewId, actionType]);


    // const attributionData = get(falcorCache, attributionPath, {});

    const columns =
        visibleCols
            .map(c => actionsConfig?.attributes?.find(md => md.name === c))
            .filter(c => c && !c.openOut && !defaultOpenOutAttributes.includes(c.name))
            .map(col => {
                const acc = getColAccessor(fn, col.name);
                return {
                    Header: col.display_name,
                    accessor: acc,
                    align: col.align || 'right',
                    width: colSizes[col.name] || '15%',
                    filter: col.filter || filters[col.display_name],
                    info: col.desc,
                    ...col,
                    type: fn[col.display_name]?.includes('array_to_string') ? 'string' : col.type
                }
            });

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        status,
                        geoid,
                        pageSize, sortBy, groupBy, fn, notNull, hiddenCols, colSizes,
                        data, columns, filters, filterValue, visibleCols, geoAttribute, actionType
                    }))
            }
        },
        [status, geoid, pageSize, sortBy, groupBy, fn, notNull, hiddenCols, colSizes,
            data, columns, filters, filterValue, visibleCols, geoAttribute, actionType
        ]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <ButtonSelector
                        label={'Action Level'}
                        types={[{label: 'State', value: 'shmp'}, {label: 'Local', value: 'lhmp'}]}
                        type={actionType}
                        setType={setActionType}
                        autoSelect={true}
                    />
                    <RenderColumnControls
                        cols={actionsConfig?.attributes?.map(c => c.name)}
                        metadata={actionsConfig?.attributes}
                        stateNamePreferences={{
                            sortBy: 'original',
                            hideCols: 'original',
                            showTotal: 'original'
                        }}
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
                        colSizes={colSizes}
                        setColSizes={setColSizes}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <ActionsTable
                                geoid={geoid}
                                data={data}
                                columns={columns}
                                hiddenCols={hiddenCols}
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