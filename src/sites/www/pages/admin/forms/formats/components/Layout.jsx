import {Link, useParams} from "react-router-dom";
import React from "react";

export const Layout = ({children, title, baseUrl}) => {
    const params = useParams();
    const url = baseUrl //.replace('93165', params.formid)
    return (
        <div className='py-6 h-full'>
            <div className='bg-white h-full shadow max-w-6xl mx-auto px-6'>
                <div className='flex items-center'>
                    <div className='text-2xl p-3 font-thin flex-1'>{title}</div>
                    <div className='px-1'>
                        <Link to={`${url}/new`}
                              className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'>
                            Create New
                        </Link>
                    </div>
                    <div className='px-1'>
                        <Link to={`${url}/list/0/10`}
                              className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'>
                            Actions Home
                        </Link>
                    </div>
                    <div className='px-1'>
                        <Link to={`/admin/forms/manage/93165`}
                              className='inline-flex w-36 justify-center rounded-lg cursor-pointer text-sm font-semibold py-1 px-4 bg-blue-600 text-white hover:bg-blue-500 shadow-lg border border-b-4 border-blue-800 hover:border-blue-700 active:border-b-2 active:mb-[2px] active:shadow-none'>
                            Meta
                        </Link>
                    </div>
                </div>
                {children}
            </div>
        </div>
    )
}