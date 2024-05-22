import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {menuItems} from "../admin/index.jsx";
import dmsFormsTheme from "../admin/forms/dmsFormsTheme.js";
import {dmsPageFactory} from "../../../../modules/dms/src/index.js";
import {withAuth} from "~/modules/ams/src"
import checkAuth from "~/layout/checkAuth"
import {Manage} from "./manage.jsx";

const Layout = ({children, title, baseUrl}) => {
    return (
        <div className='py-6 h-full'>
            <div className='bg-white h-full shadow max-w-6xl mx-auto px-6'>
                <div className='flex items-center'>
                    <div className='text-2xl p-3 font-thin flex-1'>{title}</div>
                    <div className='px-1'>
                        <Link to={`${baseUrl}/new`}
                              className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'>
                            Create New
                        </Link>
                    </div>
                    <div className='px-1'>
                        <Link to={`${baseUrl}/list`}
                              className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'>
                            Forms Home
                        </Link>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}

export const formsConfigFormat = {
    app: "dms-site",
    type: "forms-config",
    attributes: [
        {
            key: 'name',
            label: 'Name',
            type: 'text'
        },
        {
            key: 'url',
            label: 'Url',
            type: 'text'
        },
        {
            key: 'config',
            label: 'Config',
            prompt: 'Paste full config here.',
            type: 'textarea'
        },
    ]
}
const siteConfig = {
    format: formsConfigFormat,
    baseUrl: '/admin/forms/',
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
            type: (props) => <Layout {...props} title={'Forms'} baseUrl={'/admin/forms'}/>,
            path: '/*',
            action: 'list',
            children: [
                {
                    type: 'dms-table',
                    action: "list",
                    path: "/list",
                    options: {
                        columns: [
                            {
                                type: 'link',
                                name: 'Name',
                                text: ':name',
                                to: '/admin/forms/view/:id',
                                filter: "fuzzyText"
                            },
                            // {
                            //     type: 'data',
                            //     name: 'Config',
                            //     path: 'config',
                            // },
                            {
                                type: 'date',
                                name: 'Updated',
                                path: "updated_at",
                            },
                            {
                                type: 'link',
                                name: '',
                                to: '/admin/forms/form/:url/list/',
                                text: 'home'
                            },
                            {
                                type: 'link',
                                name: '',
                                to: '/admin/forms/manage/:id',
                                text: 'manage'
                            },
                            {
                                type: 'link',
                                name: '',
                                to: '/admin/forms/edit/:id',
                                text: "edit"
                            },
                        ]
                    }
                },
                {
                    type: "dms-card",
                    path: '/view/:id?',
                    action: 'view',
                    options: {
                        mapDataToProps: {
                            title: "item:data.name",
                            body: [
                                "item:data.config",
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
                    redirect: '/admin/forms/'
                },
                {
                    type: "dms-form-edit",
                    action: 'edit',
                    path: '/edit/:id?'
                },
                {
                    type: Manage,
                    action: 'edit',
                    path: '/manage/:id?'
                }
            ]
        }
    ]
}

export default {
    ...dmsPageFactory(
        siteConfig,
        withAuth,
        dmsFormsTheme
    ),
    name: "Forms",
    sideNav: {
        size: 'compact',
        color: 'white',
        menuItems
    },
    topNav: {
      size: "none"
    }
}