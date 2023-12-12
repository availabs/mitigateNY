import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {dmsDataLoader} from "../../../../../modules/dms/src/index.js";
import {DeleteModal} from "./layout/TemplateList.jsx";
import {menuItems} from "../index.jsx";

export const locationNameMap = {
    'docs-play': 'Playground',
    'docs-page': 'Live',
    'docs-draft': 'Draft'
}


const locationUrlMap = {
    'docs-play': 'playground',
    'docs-page': '',
    'docs-draft': 'drafts'
}

const NoPages = ({}) => (<div className={'p-4'}>No Pages have been generated for this template.</div>)

function TemplateRow ({ id, app, type, data={} }) {
    const navigate = useNavigate();
    const [showDelete, setShowDelete] = useState(false)
    return (
        <div className='grid grid-cols-3 px-2 py-3 border-b hover:bg-blue-50'>
            <div>
                <Link to={`/${locationUrlMap[type]}/${data?.value?.url_slug}`} >
                    <div className='px-2 font-medium text-lg text-slate-700'>
                        {data?.value?.title}
                    </div>
                    <div className='px-2 text-xs text-slate-400'>{id}</div>
                </Link>
            </div>
            <div className={'text-right px-2'}>
                {locationNameMap[type]}
            </div>
            <div className={'text-right px-2'}>
                <Link to={`/${locationUrlMap[type]}/${data?.value?.url_slug}`}
                      className={'fa-thin fa-eye px-2 py-1 mx-2 text-bold cursor-pointer'}
                      title={'view'}
                />
                <Link to={`/${locationUrlMap[type]}/edit/${data?.value?.url_slug}`}
                      className={'fa-thin fa-pencil px-2 py-1 mx-2 text-bold cursor-pointer'}
                      title={'edit'}
                />
            </div>
        </div>
    )
}

export const getConfig = ({app, type, filter}) => ({
    format: {
        app: app,
        type: type,
        attributes: [
            {
                key: 'id', label: 'id'
            },
            {
                key: 'app', label: 'app'
            },
            {
                key: 'type', label: 'type'
            },
            {
                key: 'data', label: 'data'
            }
        ]
    },
    children: [
        {
            type: () => {

            },
            action: 'load',
            filter: {
                options: JSON.stringify({
                    filter
                }),
                attributes: ['id', 'app', 'type', 'data']
            },
            path: '/'
        }
    ]
})
export const TemplatePages = ({params}) => {
    const {id} = params;
    console.log('template pages', params)
    
    if (!id) return null;
    const [value, setValue] = useState([]);

    useEffect(() => {
        (async function () {
            const res = await Object.keys(locationNameMap).reduce(async (acc, type) => {
                const prevPages = await acc;
                const currentPages = await dmsDataLoader(getConfig({app: 'dms-site', type, filter: {[`data->>'template_id'`]: [id]}}), '/');

                return [...prevPages, ...currentPages];
            }, Promise.resolve([]));


            setValue(res)
        })()
    }, [id]);

    return (
        <div className='h-full flex-1 flex flex-col text-gray-900 bg-slate-100'>
            <div className='py-6 h-full'>
                <div className='bg-white h-full shadow border max-w-6xl mx-auto px-6'>
                    <div className='flex items-center'>
                        <div className='text-2xl p-3 font-thin flex-1'>Pages</div>
                    </div>
                    <div className='px-6 pt-8'>
                        <div className='shadow rounded border'>
                            {
                                value?.length ?
                                    value.map(item => (
                                        <TemplateRow key={item.id} {...item} />
                                    )) : <NoPages />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const authMenuConfig = {
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
    topNav: {
        position: 'fixed',
        size: 'compact'
    },
}

const config = {
    name: 'Title',
    path: "/admin/templates/pages/:id?",
    exact: true,
    // auth: true,
    ...authMenuConfig,
    component: TemplatePages
}



export default config;