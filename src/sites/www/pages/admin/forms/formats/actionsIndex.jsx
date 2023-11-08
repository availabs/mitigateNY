import React, {useEffect, useState} from "react"
import {dmsDataLoader, dmsPageFactory, registerDataType} from "~/modules/dms/src"
import {falcor} from "~/modules/avl-falcor"
import {pgEnv} from "~/utils/";
import {Table} from "~/modules/avl-components/src"
import {Link, useNavigate, useParams} from 'react-router-dom'
import {withAuth} from "~/modules/ams/src"
import checkAuth from "~/layout/checkAuth"
import {menuItems} from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"
import get from "lodash/get";
import {formsConfigFormat} from "../../../forms/index.jsx";
import { fnum } from "~/utils/macros.jsx";


import {
    defaultOpenOutAttributes,
    getAccessor,
    getColAccessor,
    getMeta,
    setMeta
} from "../../../cms/dms/FormsTable/utils.js";
import {RenderColumnControls} from "../../../cms/components/columnControls.jsx";
import {ButtonSelector} from "../../../cms/components/buttonSelector.jsx";
import {Loading} from "~/utils/loading.jsx";
import {FilterSelector} from "./components/filterSelector";
import {DownloadModal} from "./components/download.jsx";
import {Layout} from "./components/Layout.jsx";
import {getData} from "./utils/getData.js";

const getNestedValue = (obj) => typeof obj?.value === 'object' ? getNestedValue(obj.value) : obj?.value || obj;
const mapColName = (columns, col) => columns.find(c => c.name === col)?.accessor;

const TableComp = ({format, ...rest}) => {
    console.log('rest', format, rest)
    const navigate = useNavigate();
    const params = useParams();
    const cachedData = {};
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(cachedData?.form || 'Actions');
    const [geoAttribute, setGeoAttribute] = useState(cachedData?.geoAttribute);
    const [metaLookupByViewId, setMetaLookupByViewId] = useState(cachedData.metaLookupByViewId || {});
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [filterValue, setFilterValue] = useState(cachedData?.filterValue || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || ['action_name', 'status']);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 10);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});
    const [groupBy, setGroupBy] = useState(cachedData?.groupBy || []);
    const [notNull, setNotNull] = useState(cachedData?.notNull || []);
    const [fn, setFn] = useState(cachedData?.fn || []);
    const [actionType, setActionType] = useState(cachedData?.actionType || 'shmp')
    const [formsConfig, setFormsConfig] = useState(format);
    const [hiddenCols, setHiddenCols] = useState(cachedData?.hiddenCols || []);
    const [colSizes, setColSizes] = useState(cachedData?.colSizes || {});
    const [data, setData] = useState(cachedData.data || [])
    const [displaySettings, setDisplaySettings] = useState(false);
    const [displayDownload, setDisplayDownload] = useState(false);
    const [manualFilters, setManualFilters] = useState({}); // {col-name:[]}

    const app = "dms-site",
        type = "forms-actions-test";
    const actionButtonClass = 'px-2 py-1 bg-blue-300 hover:bg-blue-500 text-xs hover:text-white rounded-md transition ease-in';

    useEffect(() => {
        setLoading(true)
        getData({
            formsConfig,
            actionType, form,
            metaLookupByViewId,
            setMetaLookupByViewId,
            visibleCols,
            pgEnv,
            geoid,
            geoAttribute,
            pageSize, sortBy, groupBy, fn, notNull, colSizes,
            filters, filterValue, hiddenCols,
            setData
        }, falcor);
        setLoading(false)
    }, [formsConfig, actionType, form,
        geoAttribute, geoid, metaLookupByViewId,
        pageSize, sortBy, groupBy, fn, notNull, colSizes,
        filters, filterValue, visibleCols, hiddenCols]);


    const columns = visibleCols
        .map(c => formsConfig?.attributes?.find(md => md.name === c))
        .filter(c => c && !c.openOut && !defaultOpenOutAttributes.includes(c.name) && !hiddenCols.includes(c.name))
        .map(col => {
            const acc = getColAccessor(fn, col.name, col.origin, form);
            return {
                Header: col.display_name,
                accessor: acc,
                Cell: cell => {
                    let value = getNestedValue(cell.value);
                    value =
                        ['integer', 'number'].includes(cell.column.type) ?
                            fnum(value || 0, col.isDollar) :
                            Array.isArray(value) ? value.join(', ') : value
                    if(typeof value === 'object') return  <div></div>
                    return( <div>{value}</div>);
                },
                align: col.align || 'right',
                width: colSizes[col.name] || '15%',
                filter: col.filter || filters[col.display_name],
                info: col.desc,
                ...col,
                type: fn[col.display_name]?.includes('array_to_string') ? 'string' : col.type
            }
        });

    const uniqueValues = columns.reduce((acc, column) => ({
        ...acc,
            [column.accessor]: [...new Set(data.map(d => d[column.accessor]))]
    }), {})

    const sortColRaw = columns.find(c => c.name === Object.keys(sortBy)?.[0])?.accessor;

    const filteredData = data.filter(row =>
        !Object.keys(filterValue || {}).length ||
        Object.keys(filterValue)
            .reduce((acc, col) => {
                const mappedName = mapColName(columns, col)
                const value = getNestedValue(row[mappedName]);
                return acc && value?.toString().toLowerCase().includes(filterValue[col]?.toLowerCase())
            }, true))
            .filter(row => {
                return !Object.keys(manualFilters)?.length ||
                    Object.keys(manualFilters).reduce((acc, filterCol) => acc && manualFilters[filterCol]?.includes(row[filterCol]), true)
            })

    return <>
        <div className={'w-full p-2 my-2 flex justify-end items-center font-semibold'}>
            <div className={'flex items-center px-2 text-blue-300 hover:text-blue-500 transition ease-in'}
                 title={'Download'}
                 onClick={e => setDisplayDownload(!displayDownload)}
            >
                <i className={'fa fa-download text-lg px-1'} />
                <label className={'text-sm'}>Download</label>
            </div>
            <div className={`flex items-center px-2 ${displaySettings ? `text-red-300 hover:text-red-500` : `text-blue-300 hover:text-blue-500`} transition ease-in`}
                 title={displaySettings ? 'Close Settings' : 'Open Settings'}
                 onClick={e => setDisplaySettings(!displaySettings)}
            >
                <i className={displaySettings ? 'fa fa-close text-lg px-1' : 'fa fa-gear text-lg px-1'}/>
                <label className={'text-sm'}>{displaySettings ? 'Close Settings' : 'Open Settings'}</label>
            </div>
        </div>
        <div className={`${displaySettings ? 'block' : 'hidden'} border rounded-md border-blue-500 bg-blue-50 p-2`}>
            <ButtonSelector
                label={'Action Level'}
                types={[
                    {label: 'State', value: 'shmp'},
                    {label: 'Local', value: 'lhmp'},
                    {label: 'NYRCR', value: 'nyrcr'}
                ]}
                type={actionType}
                setType={setActionType}
                autoSelect={true}
            />
            <RenderColumnControls
                cols={formsConfig?.attributes?.filter(c => ['data-variable', 'meta-variable', 'geoid-variable'].includes(c.display))?.map(c => c.name)}
                metadata={formsConfig?.attributes}
                stateNamePreferences={{
                    sortBy: 'original',
                    hideCols: 'original',
                    showTotal: 'original'
                }}
                visibleCols={visibleCols}
                setVisibleCols={setVisibleCols}
                // hiddenCols={hiddenCols}
                // setHiddenCols={setHiddenCols}
                // filters={filters}
                // setFilters={setFilters}
                // filterValue={filterValue}
                // setFilterValue={setFilterValue}
                // pageSize={pageSize}
                // setPageSize={setPageSize}
                // groupBy={groupBy}
                // setGroupBy={setGroupBy}
                // fn={fn}
                // setFn={setFn}
                // sortBy={sortBy}
                // setSortBy={setSortBy}
                // notNull={notNull}
                // setNotNull={setNotNull}
                // colSizes={colSizes}
                // setColSizes={setColSizes}
            />

            <FilterSelector
                filters={manualFilters}
                setFilters={setManualFilters}
                columns={columns}
                uniqueValues={uniqueValues}
            />
        </div>

        <DownloadModal
            displayDownload={displayDownload}
            setDisplayDownload={setDisplayDownload}
            visibleCols={visibleCols}
            columns={formsConfig?.attributes?.filter(c => ['data-variable', 'meta-variable', 'geoid-variable'].includes(c.display))}
            data={data}
            filteredData={filteredData}
            form={form}

            formsConfig={formsConfig}
            actionType={actionType}
            metaLookupByViewId={metaLookupByViewId}
            setMetaLookupByViewId={setMetaLookupByViewId}
            pgEnv={pgEnv}
            geoid={geoid}
            geoAttribute={geoAttribute}
            pageSize={pageSize} sortBy={sortBy} groupBy={groupBy} fn={fn} notNull={notNull} colSizes={colSizes}
            filters={filters} filterValue={filterValue} manualFilters={manualFilters} hiddenCols={hiddenCols}
            falcor={falcor}
            getNestedValue={getNestedValue}
        />

        {
            loading ? <Loading/> :
                <Table data={filteredData} // filter data from fromIndex
                       columns={[
                           ...columns,
                           {
                               Header: ' ',
                               accessor: 'edit',
                               Cell: d => {
                                   return (
                                       <div className={'flex flex-row flex-wrap justify-between'}>
                                           <Link
                                               className={actionButtonClass}
                                               to={`/admin/forms/form/93165/view/${d?.cell?.row?.original?.id}`}> view </Link>
                                           <Link
                                               className={actionButtonClass}
                                               to={`/admin/forms/form/93165/edit/${d?.cell?.row?.original?.id}`}> edit </Link>
                                       </div>
                                   )
                               },
                               width: '3%'
                           }]}
                       initialPageSize={pageSize}
                       pageSize={pageSize}
                       sortBy={sortColRaw}
                       sortOrder={Object.values(sortBy)?.[0] || 'asc'}
                />
        }
    </>
}
const siteConfig = {
    formatFn: async () => {
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
        return JSON.parse(config);
    },
    check: ({user}, activeConfig, navigate) => {

        const getReqAuth = (configs) => {
            return configs.reduce((out, config) => {
                let authLevel = config.authLevel || -1
                if (config.children) {
                    authLevel = Math.max(authLevel, getReqAuth(config.children))
                }
                return Math.max(out, authLevel)
            }, -1)
        }

        let requiredAuth = getReqAuth(activeConfig)
        checkAuth({user, authLevel: requiredAuth}, navigate)

    },
    children: [
        {
            type: (props) => <Layout {...props} title={'Actions'} baseUrl={'/admin/forms/form/93165'}/>,
            path: '/*',
            action: 'list',
            filter: {
                fromIndex: path => path.split('/')[2],
                toIndex: path => path.split('/')[3],
                stopFullDataLoad: true
            },
            children: [
                {
                    type: props =>
                        <TableComp
                            data={props.dataItems}
                            columns={(formid) => [
                                {
                                    Header: 'Action Name',
                                    accessor: 'action_name',
                                    type: 'link',
                                    name: 'Name',
                                    text: 'action_name',
                                    // path: ':action_name',
                                    to: `/admin/forms/form/${formid}/view/:id`,
                                    filter: "fuzzyText",
                                    Cell: d => {
                                        return <Link
                                            to={`/admin/forms/form/${formid}/view/${d?.cell?.row?.original?.id}`}> {d?.cell?.row?.original?.action_name} </Link>
                                    }
                                },
                                {
                                    Header: 'Action Type',
                                    accessor: 'action_type',
                                    text: 'action_type',
                                    type: 'data',
                                    name: 'Type',
                                    path: "action_type",
                                },
                                // {
                                //     Header: 'Description',
                                //     accessor: 'description',
                                //     type: 'data',
                                //     name: 'Description',
                                //     path: "description_of_problem_being_mitigated",
                                // },
                                {
                                    Header: ' ',
                                    accessor: 'edit',
                                    Cell: d => {
                                        return <Link
                                            to={`/admin/forms/form/${formid}/edit/${d?.cell?.row?.original?.id}`}> edit </Link>
                                    }
                                }
                                //   { type: 'date',
                                //   name: 'Updated',
                                //   path: "updated_at",
                                // },
                                // { type: 'link',
                                //     name: '',
                                //     to: '/admin/forms/form/93165/edit/:id',
                                //     text: "edit"
                                // }
                            ]}
                            {...props}
                        />,
                    // type: 'dms-table',
                    action: "",
                    path: "/list/",
                    // filter: {
                    //     fromIndex: 'from',
                    //     toIndex: 'to',
                    // },
                },
                {
                    type: "dms-form-view",
                    path: '/view/:id?',
                    action: 'view',
                    options: {
                        accessor: 'name'
                    }

                },
                {
                    type: "dms-form-edit",
                    action: 'edit',
                    options: {
                        accessor: 'name'
                    },
                    filter: {type: 'new'},
                    path: '/new',
                    redirect: '/edit/:id?'
                },
                {
                    type: "dms-form-edit",
                    action: 'edit',
                    options: {
                        accessor: 'name'
                    },
                    path: '/edit/:id?'
                }
            ]
        }
    ]
}

export default {
    ...dmsPageFactory(
        siteConfig,
        "/admin/forms/form/93165/",
        withAuth,
        dmsFormsTheme
    ),
    name: "Actions",
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
    // topNav: {
    //   size: "none"
    // }
}