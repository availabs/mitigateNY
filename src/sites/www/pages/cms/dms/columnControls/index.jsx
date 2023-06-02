import React from "react";
import { Switch } from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const RenderColumnControls = (
    {
        cols=[],
        anchorCols=[],
        visibleCols=[], setVisibleCols,
        filters={}, setFilters,
        pageSize, setPageSize,
        sortBy, setSortBy
}) => {
    return (
        <div>
            <div key={'shadow'} className={'shadow-md shadow-blue-100 p-1.5'}></div>

            <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
                <label className={'shrink-0 pr-2 py-2 my-1'}>Page Size</label>
                <input
                    key={'pageSizeInput'}
                    className={'p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                    type={"number"}
                    placeholder={'Page Size'}
                    value={pageSize || 0}
                    onChange={e => e.target.value > 0 && setPageSize(e.target.value)}
                    onWheel={() => {}}
                />
            </div>

            <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
                <label className={'shrink-0 pr-2 py-2 my-1'}> Display Columns: </label>
                <select
                    key={'displayColsInput'}
                    value={' '}
                    className={'p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                    onChange={e => setVisibleCols([...visibleCols, e.target.value])}
                >
                    <option key={0} value={' '}> Select a Column </option>
                    {
                        cols
                            .filter(c => !visibleCols.includes(c) && !anchorCols.includes(c))
                            .map(c => <option key={c} value={c}>{c}</option>)
                    }
                </select>
            </div>



            <div className={'flex flex-col sm:flex-row space-between my-1 text-sm'}>
                {
                    cols
                        .filter(c => visibleCols.includes(c) || anchorCols.includes(c))
                        .map((c, i) => (
                            <div
                                key={`col-settings-${c}`}
                                className={'mx-0.5 flex flex-col justify-between p-2 border border-dashed border-blue-300 rounded-md w-[500px]'}>
                                <div className={'font-normal w-full h-full flex flex-row justify-between'}>
                                    <label key={`label-${c}`} className={'mb-auto'}>{c}</label>
                                    {
                                        !anchorCols.includes(c) && (
                                            <button
                                                key={`cancel-${c}`}
                                                className={'align-top mb-auto pt-1 hover:text-red-500 text-slate-40'}
                                                onClick={() => setVisibleCols(visibleCols.filter(v => v !== c))}
                                            >
                                                <i className={`fa-light fa-xmark fa-fw float-right`} title={'remove'}></i>
                                            </button>
                                        )
                                    }
                                </div>

                                <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
                                    <label className={'align-bottom shrink-0 pr-2 py-2 my-1'}> Filter: </label>
                                    <select
                                        key={`filter-${c}`}
                                        className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                                        value={filters[c]}
                                        onChange={e => setFilters({...filters, ...{[c]: e.target.value}})}
                                        disabled={anchorCols.includes(c)}
                                    >
                                        <option key={`filter-none-${c}`} value={' '}>None</option>
                                        <option key={`filter-text-${c}`} value={'text'}>Text</option>
                                    </select>
                                </div>

                                <div className={'w-full py-2 justify-between'}>
                                    <label className={'align-bottom shrink-0 pr-2 py-2 my-1'}> Default Sort by: </label>
                                    <Switch
                                        key={`sortby-${c}`}
                                        checked={sortBy?.[c] || false}
                                        onChange={e => setSortBy({[c]: e && 'asc'})}
                                        className={classNames(
                                            sortBy?.[c] ? 'bg-indigo-600' : 'bg-gray-200',
                                            `relative inline-flex 
                                            h-4 w-10 
                                            flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                                            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                                            focus:ring-indigo-600 focus:ring-offset-2`
                                        )}
                                    >
                                        <span className="sr-only">toggle default sort</span>
                                        <span
                                            aria-hidden="true"
                                            className={classNames(
                                                sortBy?.[c] ? 'translate-x-5' : 'translate-x-0',
                                                `pointer-events-none inline-block 
                                                h-3 w-4
                                                transform rounded-full bg-white shadow ring-0 t
                                                ransition duration-200 ease-in-out`
                                            )}
                                        />
                                    </Switch>
                                </div>
                                <div className={'w-full flex justify-between'}>
                                    <label className={'align-bottom shrink-0 pr-2 py-2 my-1'}> Order: </label>
                                    <select
                                        key={`order-${c}`}
                                        className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                                        value={sortBy[c]}
                                        onChange={e => setSortBy({[c]: e.target.value})}
                                        disabled={!sortBy?.[c]}
                                    >
                                        <option key={`order-asc-${c}`} value={'asc'}>Ascending</option>
                                        <option key={`order-desc-${c}`} value={'desc'}>Descending</option>
                                    </select>
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}