import React, {useState} from "react";
import {Switch} from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const RenderPageSizeControl = ({pageSize, setPageSize}) => {
    const [tmpPageSize, setTmpPageSize] = useState(pageSize);

    if (!setPageSize) return null;

    return (
        <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
            <label className={'shrink-0 pr-2 py-2 my-1 w-1/4'}>Table Page Size</label>
            <input
                key={'pageSizeInput'}
                className={'p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                type={"number"}
                placeholder={'Table Page Size'}
                value={tmpPageSize}
                onChange={e => {
                    setTmpPageSize(e.target.value);
                    if (e.target.value > 0) setPageSize(e.target.value);
                }}
                onWheel={() => {
                }}
            />
        </div>
    )
};

const RenderColumnSelector = ({cols, anchorCols, visibleCols, setVisibleCols}) => (
    <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
        <label className={'shrink-0 pr-2 py-2 my-1 w-1/4'}> Display Columns: </label>
        <select
            key={'displayColsInput'}
            value={' '}
            className={'p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
            onChange={e => setVisibleCols([...visibleCols, e.target.value])}
        >
            <option key={0} value={' '}> Select a Column</option>
            {
                cols
                    .filter(c => !visibleCols.includes(c) && !anchorCols.includes(c))
                    .map(c => <option key={c} value={c}>{c}</option>)
            }
        </select>
    </div>
);

const RenderFilterControls = ({column, filters, setFilters, anchorCols}) => {
    if (!setFilters) return null;
    return (
        <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1'}> Filter: </label>
            <select
                key={`filter-${column}`}
                className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                value={filters[column]}
                onChange={e => setFilters({...filters, ...{[column]: e.target.value}})}
                disabled={anchorCols.includes(column)}
            >
                <option key={`filter-none-${column}`} value={' '}>None</option>
                <option key={`filter-text-${column}`} value={'text'}>Text</option>
            </select>
        </div>
    )
}

const RenderFilterValueControls = ({column, filterValue, setFilterValue}) => {
    if (!setFilterValue) return null;
    return (
        <div className={'w-full pt-2 mt-3 flex flex-row text-sm'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1'}> Filter by: </label>
            <input
                type={'text'}
                className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                value={filterValue[column]}
                placeholder={'filter by'}
                onChange={e => setFilterValue({...filterValue, ...{[column]: e.target.value}})}
            />
            {/*<select*/}
            {/*    key={`filter-value-${column}`}*/}
            {/*    className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}*/}
            {/*    value={filterValue[column]}*/}
            {/*    onChange={e => setFilters({...filters, ...{[column]: e.target.value}})}*/}
            {/*>*/}
            {/*    <option key={`filter-none-${column}`} value={' '}>None</option>*/}
            {/*    <option key={`filter-text-${column}`} value={'text'}>Text</option>*/}
            {/*</select>*/}
        </div>
    )
}

const RenderSortControls = ({column, sortBy, setSortBy}) => {
    if (!setSortBy) return null;
    return (
        <>
            <div className={'block shrink-0 w-full py-2 justify-between'}>
                <label className={'align-bottom pr-2 py-2 my-1'}> Default Sort by: </label>
                <Switch
                    key={`sortby-${column}`}
                    checked={sortBy?.[column] || false}
                    onChange={e => setSortBy({[column]: e && 'asc'})}
                    className={classNames(
                        sortBy?.[column] ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                                            h-4 w-10 
                                             cursor-pointer rounded-full border-2 border-transparent 
                                            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                                            focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle default sort</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            sortBy?.[column] ? 'translate-x-5' : 'translate-x-0',
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
                    key={`order-${column}`}
                    className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                    value={sortBy[column]}
                    onChange={e => setSortBy({[column]: e.target.value})}
                    disabled={!sortBy?.[column]}
                >
                    <option key={`order-asc-${column}`} value={'asc'}>Ascending</option>
                    <option key={`order-desc-${column}`} value={'desc'}>Descending</option>
                </select>
            </div>
        </>
    )
}

const RenderColumnBoxes = ({cols, anchorCols, visibleCols, setVisibleCols, filters, setFilters, filterValue, setFilterValue, sortBy, setSortBy}) => (
    <div className={'flex flex-row flex-wrap space-between my-1 text-sm'}>
        {
            cols
                .filter(c => visibleCols.includes(c) || anchorCols.includes(c))
                .map((col, i) => (
                    <div
                        key={`col-settings-${col}`}
                        className={
                            'm-1 flex flex-col justify-between p-2 ' +
                            `border border-dashed border-blue-${anchorCols.includes(col) ? `500` : `300`} rounded-md`}>
                        <div className={'font-normal w-full h-full flex flex-row justify-between'}>
                            <label key={`label-${col}`} className={'mb-auto'}>{col}</label>
                            {
                                !anchorCols.includes(col) && (
                                    <button
                                        key={`cancel-${col}`}
                                        className={'align-top mb-auto pt-1 hover:text-red-500 text-slate-40'}
                                        onClick={() => setVisibleCols(visibleCols.filter(v => v !== col))}
                                    >
                                        <i className={`fa-light fa-xmark fa-fw float-right`} title={'remove'}></i>
                                    </button>
                                )
                            }
                        </div>

                        <RenderFilterControls column={col}
                                              anchorCols={anchorCols}
                                              filters={filters} setFilters={setFilters} />

                        <RenderFilterValueControls column={col}
                                              filterValue={filterValue} setFilterValue={setFilterValue} />
                        
                        <RenderSortControls column={col}
                                            sortBy={sortBy} setSortBy={setSortBy} />
                        
                    </div>
                ))
        }
    </div>
);

export const RenderColumnControls = (
    {
        cols = [],
        anchorCols = [],
        visibleCols = [], setVisibleCols,
        filters = {}, setFilters,
        filterValue = {}, setFilterValue,
        pageSize, setPageSize,
        sortBy, setSortBy
    }) => {

    return (
        <div>
            <div key={'shadow'} className={'shadow-md shadow-blue-100 p-1.5'}></div>

            <RenderPageSizeControl pageSize={pageSize}
                                   setPageSize={setPageSize} />

            <RenderColumnSelector cols={cols}
                                  anchorCols={anchorCols}
                                  visibleCols={visibleCols} setVisibleCols={setVisibleCols} />

            <RenderColumnBoxes cols={cols}
                               anchorCols={anchorCols}
                               visibleCols={visibleCols} setVisibleCols={setVisibleCols}
                               filters={filters} setFilters={setFilters}
                               filterValue={filterValue} setFilterValue={setFilterValue}
                               sortBy={sortBy} setSortBy={setSortBy} />
        </div>
    )
}