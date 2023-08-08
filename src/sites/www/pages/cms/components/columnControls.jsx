import React, {useState} from "react";
import {Switch} from '@headlessui/react';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const RenderPageSizeControl = ({pageSize, setPageSize}) => {
    const [tmpPageSize, setTmpPageSize] = useState(pageSize);

    if (!setPageSize) return null;

    return (
        <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
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
                onWheel={e => e.target.blur()}
            />
        </div>
    )
};

const RenderColumnSelector = ({cols, anchorCols, visibleCols, setVisibleCols}) => (
    <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
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

const RenderGroupControls = ({column, groupBy, setGroupBy, fn}) => {
    if (!setGroupBy) return null;

    const isActive = groupBy.includes(column);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Group by: </label>
            <div className={'align-bottom p-2 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`groupby-${column}`}
                    checked={groupBy.includes(column)}
                    onChange={e => isActive ? setGroupBy(groupBy.filter(gb => gb !== column)) : setGroupBy([...groupBy, column])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle group by</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            ransition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderFnControls = ({column, fn, setFn, groupBy}) => {
    if (!setFn) return null;

    const functions = [
        {label: 'None', value: column},
        {label: 'List', value: `array_to_string(array_agg(distinct ${column}), ', ') as ${column}`},
        {label: 'Sum', value: `sum(${column}) as ${column}`},
    ]

    // clear set fn if groupBy is active
    groupBy.includes(column) && fn[column] !== column && setFn({...fn, ...{[column]: column}});

    // set fn to list if not already selected on group by selected
    groupBy.length && !groupBy.includes(column) && (fn[column] === column || !fn[column])&&
    setFn({...fn, ...{[column]: functions.find(f => f.label === 'List')?.value}});

    // when all groupBy toggles are inactive, set fn to None
    !groupBy.length && fn[column] !== column && setFn({...fn, ...{[column]: column}})

    return (
        <div className={'block w-full flex justify-between'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Function: </label>
            <select
                key={`fn-${column}`}
                className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                value={fn[column]}
                onChange={e => setFn({...fn, ...{[column]: e.target.value}})}
                disabled={!groupBy.length}
            >
                {
                    functions.map(fn => <option key={`fn-${column}-${fn.label}`} value={fn.value}> {fn.label} </option>)
                }
            </select>
        </div>
    )
}

const RenderFilterControls = ({column, filters, setFilters, anchorCols}) => {
    if (!setFilters) return null;
    return (
        <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Filter: </label>
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
        <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Filter by: </label>
            <input
                type={'text'}
                className={'align-bottom p-2 ml-2 my-1 bg-white rounded-md w-full shrink'}
                value={filterValue[column]}
                placeholder={'filter by'}
                onChange={e => {
                    const tmpVal = JSON.parse(JSON.stringify(filterValue));
                    if (!e.target.value) delete tmpVal[column];
                    const newValue = e.target.value ?
                        {
                            ...tmpVal,
                            ...{[column]: e.target.value ? e.target.value : undefined}
                        } : tmpVal;

                    setFilterValue(newValue)
                }
                }
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
            <div className={'block shrink-0 w-full flex'}>
                <label className={'align-bottom pr-2 py-2 my-1 w-1/4'}> Sort by: </label>
                <div className={'align-bottom p-2 my-1 rounded-md shrink self-center'}>
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
                        <span className="sr-only">toggle sort</span>
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
            </div>

            <div className={'w-full flex justify-between'}>
                <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Order: </label>
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

const RenderColumnBoxes = ({
                               cols,
                               anchorCols,
                               visibleCols, setVisibleCols,
                               filters, setFilters,
                               filterValue, setFilterValue,
                               groupBy, setGroupBy,
                               fn, setFn,
                               sortBy, setSortBy
                           }) => (
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
                            <button
                                key={`cancel-${col}`}
                                className={
                                    anchorCols.includes(col) ? `hidden` :
                                        `align-top mb-auto pt-1 hover:text-red-500 text-slate-40`
                                }
                                onClick={() => setVisibleCols(visibleCols.filter(v => v !== col))}
                            >
                                <i className={`fa-light fa-xmark fa-fw float-right`} title={'remove'}></i>
                            </button>
                        </div>

                        <RenderFilterControls column={col}
                                              anchorCols={anchorCols}
                                              filters={filters} setFilters={setFilters}/>

                        <RenderFilterValueControls column={col}
                                                   filterValue={filterValue} setFilterValue={setFilterValue}/>

                        <RenderGroupControls column={col}
                                             groupBy={groupBy} setGroupBy={setGroupBy} fn={fn}/>

                        <RenderFnControls column={col}
                                             fn={fn} setFn={setFn} groupBy={groupBy}/>

                        <RenderSortControls column={col}
                                            sortBy={sortBy} setSortBy={setSortBy}/>

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
        groupBy = [], setGroupBy,
        fn = {}, setFn,
        sortBy = {}, setSortBy,
        pageSize, setPageSize
    }) => {

    return (
        <div>
            <div key={'shadow'} className={'shadow-md shadow-blue-100 p-1.5'}></div>

            <RenderPageSizeControl pageSize={pageSize}
                                   setPageSize={setPageSize}/>

            <RenderColumnSelector cols={cols}
                                  anchorCols={anchorCols}
                                  visibleCols={visibleCols} setVisibleCols={setVisibleCols}/>

            <RenderColumnBoxes cols={cols}
                               anchorCols={anchorCols}
                               visibleCols={visibleCols} setVisibleCols={setVisibleCols}
                               filters={filters} setFilters={setFilters}
                               filterValue={filterValue} setFilterValue={setFilterValue}
                               sortBy={sortBy} setSortBy={setSortBy}
                               groupBy={groupBy} setGroupBy={setGroupBy}
                               fn={fn} setFn={setFn}
            />
        </div>
    )
}