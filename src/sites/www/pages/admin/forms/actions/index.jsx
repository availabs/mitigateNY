import React, {useState} from "react"
import {dmsPageFactory, registerDataType} from "~/modules/dms/src"
import {falcor} from "~/modules/avl-falcor"
import {Table} from "~/modules/avl-components/src"
import {Link, useNavigate, useParams} from 'react-router-dom'
import {withAuth} from "~/modules/ams/src"
import checkAuth from "~/layout/checkAuth"
import cmsFormat from "./actions.format.js"

import {menuItems} from "../../index"
import dmsFormsTheme from "../dmsFormsTheme"
import get from "lodash/get";

// registerDataType("selector", Selector)

const Layout = ({children, title, baseUrl}) => (
    <div className='py-6 h-full'>
        <div className='bg-white h-full shadow max-w-6xl mx-auto px-6'>
            <div className='flex items-center'>
                <div className='text-2xl p-3 font-thin flex-1'>{title}</div>
                <div className='px-1'><Link to={`${baseUrl}/new`} className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'> Create New</Link></div>
                <div className='px-1'><Link to={`${baseUrl}/list/0/10`} className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'> Actions Home </Link></div>
            </div>
            {children}
        </div>
    </div>
)

const TableComp = ({data, columns, ...rest}) => {
    const navigate = useNavigate();
    const params = useParams();
    const [length, setLength] = useState(0);

    const app = "dms-site",
        type = "forms-actions-test";

    const lengthReq = ['dms', 'data', `${app}+${type}`, 'length'];

    (async function () {
        await falcor.get(lengthReq).then(d => {
            const newLen = +get(d, ['json', ...lengthReq], 0);
            length !== newLen && setLength(newLen)
        })
    })();

    let pageSize = 10

    let fromIndex =
        typeof rest?.filter?.fromIndex === 'function' ?
            rest?.filter?.fromIndex(params['*']) :
            (+rest.params?.[rest?.filter?.fromIndex] || 0);
    let toIndex =
        typeof rest?.filter?.toIndex === "function" ?
            rest?.filter?.toIndex(params['*']) :
            (+rest.params?.[rest?.filter?.toIndex] || length - 1);

    let currentPage = fromIndex / pageSize;

    return <Table data={data} // filter data from fromIndex
                  columns={columns}
                  manualPagination={true}
                  numRecords={length}
                  pageSize={pageSize}
                  manualCurrentPage={currentPage}
                  onPageChange={(p) => {
                      const nextFromINdex = p * pageSize;
                      const nextToIndex = nextFromINdex + pageSize;
                      navigate(`/admin/forms/actions/list/${nextFromINdex}/${nextToIndex}`)
                  }}
    />
}
const siteConfig = {
    format: cmsFormat,
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
            type: (props) => <Layout {...props} title={'Actions'} baseUrl={'/admin/forms/actions'}/>,
            path: '/*',
            action: 'list',
            filter: {
                fromIndex: path => path.split('/')[2],
                toIndex: path => path.split('/')[3],
                stopFullDataLoad: true
            },
            children: [{
                type: props =>
                    <TableComp
                        data={props.dataItems}
                        columns={[
                            // {
                            //     Header: 'Local/State',
                            //     accessor: 'idKey'
                            // },
                            {
                                Header: 'Action Name',
                                accessor: 'action_name',
                                type: 'link',
                                name: 'Name',
                                text: 'action_name',
                                // path: ':action_name',
                                to: '/admin/forms/actions/view/:id',
                                filter: "fuzzyText",
                                Cell: d => {
                                    return <Link
                                        to={`/admin/forms/actions/view/${d?.cell?.row?.original?.id}`}> {d?.cell?.row?.original?.action_name} </Link>
                                }
                            },
                            {
                                Header: 'Action Type',
                                accessor: 'action_type',
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
                                        to={`/admin/forms/actions/edit/${d?.cell?.row?.original?.id}`}> edit </Link>
                                }
                            }
                            //   { type: 'date',
                            //   name: 'Updated',
                            //   path: "updated_at",
                            // },
                            // { type: 'link',
                            //     name: '',
                            //     to: '/admin/forms/actions/edit/:id',
                            //     text: "edit"
                            // }
                        ]}
                        {...props}
                    />,
                // type: 'dms-table',
                action: "list",
                path: "/list/:from?/:to?",
                filter: {
                    fromIndex: 'from',
                    toIndex: 'to',
                },
            },
                {
                    type: "dms-form-view",
                    path: '/view/:id?',
                    action: 'view',
                    options: {
                        mapDataToProps: {
                            title: "item:data.name",
                            body: [
                                "item:data.description_of_problem_being_mitigated",
                            ],
                            footer: [
                                "item:updated_at"
                            ]
                        },
                    }

                },
                {
                    type: "dms-form-edit",
                    action: 'edit',
                    filter: {type: 'new'},
                    path: '/new',
                    redirect: '/admin/forms/actions'
                },
                {
                    type: "dms-form-edit",
                    action: 'edit',
                    path: '/edit/:id?'
                }
            ]
        }
    ]
}

export default {
    ...dmsPageFactory(
        siteConfig,
        "/admin/forms/actions/",
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