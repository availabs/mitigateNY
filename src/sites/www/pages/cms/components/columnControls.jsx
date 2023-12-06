import React, {useEffect, useMemo, useRef, useState} from "react";
import {Switch} from '@headlessui/react';
import {ButtonSelector} from "./buttonSelector.jsx";

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
                className={'p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
                type={"number"}
                placeholder={'Table Page Size'}
                value={tmpPageSize}
                onChange={e => {
                    setTmpPageSize(e.target.value);
                    if (e.target.value > 0) setPageSize(+e.target.value);
                }}
                onWheel={e => e.target.blur()}
            />
        </div>
    )
};

const RenderColumnSelector = ({cols, anchorCols, visibleCols, setVisibleCols, metadata}) => (
    <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
        <label className={'shrink-0 pr-2 py-2 my-1 w-1/4'}> Display Columns: </label>
        <select
            key={'displayColsInput'}
            value={' '}
            className={'p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
            onChange={e => setVisibleCols([...visibleCols, e.target.value])}
        >
            <option key={0} value={' '}> Select a Column</option>
            {
                cols
                    .filter(c => !visibleCols.includes(c) && !anchorCols.includes(c))
                    .map(c =>
                        <option key={c} value={c}>
                            {metadata.find(md => md.name === c)?.display_name || c}
                        </option>)
            }
        </select>
    </div>
);

const RenderGroupControls = ({column, groupBy, setGroupBy, fn, metadata}) => {
    if (!setGroupBy || !['meta-variable', 'geoid-variable'].includes(metadata?.display)) return null;
    // when grouping by, remove 'as ..'
    const groupableName = column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];
    const isActive = groupBy.includes(groupableName);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Group by: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`groupby-${column}`}
                    checked={isActive}
                    onChange={e => isActive ? setGroupBy(groupBy.filter(gb => gb !== groupableName)) : setGroupBy([...groupBy, groupableName])}
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
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderFnControls = ({column, fn, setFn, groupBy, metadata}) => {
    if (!setFn || metadata?.display === 'calculated-column') return null;

    const groupableName = column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];
    const nonGroupableTitle = (column.includes(' as') ? column.split('as ')[1] : column.split('AS ')[1]) || groupableName;

    const functions = [
        {label: 'None', value: column},
        {label: 'List', value: `array_to_string(array_agg(distinct ${groupableName}), ', ') as ${nonGroupableTitle}`},
        {label: 'Sum', value: `sum(${groupableName}) as ${nonGroupableTitle}`},
    ]

    const alreadyAggregated = groupableName.includes('count(') || groupableName.includes('sum(');

    const defaultFn =
        alreadyAggregated ?
            functions.find(f => f.label === 'None')?.value :
            (
                functions.find(f => f.label === metadata?.defaultFn)?.value ||
                functions.find(f => f.label === 'List')?.value
            )
    // clear set fn if groupBy is active
    groupBy.includes(groupableName) && fn[column] !== column && setFn({...fn, ...{[column]: column}});

    // set fn to list if not already selected on group by selected
    groupBy.length &&
    !groupBy.includes(groupableName) &&
    !alreadyAggregated && (fn[column] === column || !fn[column]) &&
    setFn({...fn, ...{[column]: defaultFn}});

    // when all groupBy toggles are inactive, set fn to None
    !groupBy.length && fn[column] !== column && setFn({...fn, ...{[column]: column}})

    return (
        <div className={'block w-full flex justify-between'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Function: </label>
            <select
                key={`fn-${column}`}
                className={'align-bottom p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
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

const RenderNullControls = ({column, notNull, setNotNull}) => {
    if (!setNotNull) return null;
    const groupableName = column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];

    const isActive = notNull.includes(groupableName);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Exclude N/A: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`notNull-${groupableName}`}
                    checked={notNull.includes(groupableName)}
                    onChange={e => isActive ? setNotNull(notNull.filter(gb => gb !== groupableName)) : setNotNull([...notNull, groupableName])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle not null by</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderShowTotalControls = ({column, index, showTotal, setShowTotal, fn}) => {
    if (!setShowTotal || index === 0) return null;
    const colNameWithFn = fn[column] || column //column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];

    const isActive = showTotal.includes(colNameWithFn);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Show Total: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`show-total-${colNameWithFn}`}
                    checked={showTotal.includes(colNameWithFn)}
                    onChange={e => isActive ? setShowTotal(showTotal.filter(st => st !== colNameWithFn)) : setShowTotal([...showTotal, colNameWithFn])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle show total</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderHideControls = ({column, hiddenCols, setHiddenCols, fn}) => {
    if (!setHiddenCols) return null;
    const colNameWithFn = fn[column] || column //column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];

    const isActive = hiddenCols.includes(colNameWithFn);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Hide: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`hide-${colNameWithFn}`}
                    checked={hiddenCols.includes(colNameWithFn)}
                    onChange={e => isActive ? setHiddenCols(hiddenCols.filter(st => st !== colNameWithFn)) : setHiddenCols([...hiddenCols, colNameWithFn])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle hide column</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderExtFilterControls = ({column, extFilterCols, setExtFilterCols, fn}) => {
    if (!setExtFilterCols) return null;
    const colNameWithFn = fn[column] || column //column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];

    const isActive = extFilterCols.includes(colNameWithFn);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> External Filter: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`extFilter-${colNameWithFn}`}
                    checked={extFilterCols.includes(colNameWithFn)}
                    onChange={e => isActive ? setExtFilterCols(extFilterCols.filter(st => st !== colNameWithFn)) : setExtFilterCols([...extFilterCols, colNameWithFn])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle ext filter column</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
        </div>
    )
}

const RenderOpenOutControls = ({column, openOutCols, setOpenOutCols, fn}) => {
    if (!setOpenOutCols) return null;
    const colNameWithFn = fn[column] || column //column.includes(' as') ? column.split(' as')[0] : column.split(' AS')[0];

    const isActive = openOutCols.includes(colNameWithFn);

    return (
        <div className={'block w-full flex mt-1'}>
            <label className={'align-bottom shrink-0pr-2 py-2 my-1 w-1/4'}> Open Out: </label>
            <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`openout-${colNameWithFn}`}
                    checked={openOutCols.includes(colNameWithFn)}
                    onChange={e => isActive ? setOpenOutCols(openOutCols.filter(st => st !== colNameWithFn)) : setOpenOutCols([...openOutCols, colNameWithFn])}
                    className={classNames(
                        isActive ? 'bg-indigo-600' : 'bg-gray-200',
                        `relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    )}
                >
                    <span className="sr-only">toggle open out column</span>
                    <span
                        aria-hidden="true"
                        className={classNames(
                            isActive ? 'translate-x-5' : 'translate-x-0',
                            `pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0 t
                            transition duration-200 ease-in-out`
                        )}
                    />
                </Switch>
            </div>
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
                className={'align-bottom p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
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
                className={'align-bottom p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
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
        </div>
    )
}

const RenderSortControls = ({column, sortBy, setSortBy, fn, stateNamePreferences}) => {
    if (!setSortBy) return null;
    const fnColumn = stateNamePreferences === 'original' ? column : (fn[column] || column );

    return (
        <>
            <div className={'block shrink-0 w-full flex'}>
                <label className={'align-bottom pr-2 py-2 my-1 w-1/4'}> Sort by: </label>
                <div className={'align-bottom p-2 pl-0 my-1 rounded-md shrink self-center'}>
                    <Switch
                        key={`sortby-${column}`}
                        checked={sortBy?.[fnColumn] || false}
                        onChange={e => setSortBy(sortBy?.[fnColumn] ? {} : {[fnColumn]: e && 'asc'})}
                        className={classNames(
                            sortBy?.[fnColumn] ? 'bg-indigo-600' : 'bg-gray-200',
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
                                sortBy?.[fnColumn] ? 'translate-x-5' : 'translate-x-0',
                                `pointer-events-none inline-block 
                                                h-3 w-4
                                                transform rounded-full bg-white shadow ring-0 t
                                                transition duration-200 ease-in-out`
                            )}
                        />
                    </Switch>
                </div>
            </div>

            <div className={'w-full flex justify-between'}>
                <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Order: </label>
                <select
                    key={`order-${column}`}
                    className={'align-bottom p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
                    value={sortBy?.[fnColumn]}
                    onChange={e => setSortBy({[fnColumn]: e.target.value})}
                    disabled={!sortBy?.[fnColumn]}
                >
                    <option key={`order-asc-${column}`} value={'asc'}>Ascending</option>
                    <option key={`order-desc-${column}`} value={'desc'}>Descending</option>
                </select>
            </div>
        </>
    )
}

const RenderSizeControls = ({column, colSizes, setColSizes}) => {
    if (!setColSizes) return null;
    const [ customSize, setCustomSize ] = useState(false);
    const currentSize = colSizes[column] || '15%';

    const sizeOptions = [
        {label: 'x-small (5%)', value: '5%'},
        {label: 'small (15%)', value: '15%'},
        {label: 'medium (20%)', value: '20%'},
        {label: 'large (25%)', value: '25%'},
        {label: 'x-large (35%)', value: '35%'},
        {label: 'custom', value: 'custom'}
    ];

    const sizes = sizeOptions.map(s => s.value).filter(s => s !== 'custom')

    useEffect(() => {
        setCustomSize(!sizes.includes(currentSize))
    }, [currentSize]);

    return (
        <>
            <ButtonSelector
                label={'Size:'}
                types={sizeOptions}
                type={currentSize}
                setType={e => {
                    sizes.includes(e) ?
                        setColSizes({...colSizes, [column]: e}) :
                        setCustomSize(true);
                }}
            />
            {
                customSize ?
                    <input
                        key={'colSizeInput'}
                        className={'p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
                        type={"number"}
                        placeholder={'size in %'}
                        value={currentSize.replace('%', '')}
                        onChange={e => {
                            if (e.target.value > 0) setColSizes({colSizes, [column]: `${e.target.value}%`});
                        }}
                        onWheel={e => e.target.blur()}
                    /> : null
            }
        </>
    )
}

const RenderJustifyControls = ({column, colJustify, setColJustify}) => {
    if (!setColJustify) return null;
    const currentValue = colJustify[column] || 'right';

    return (
        <ButtonSelector
            label={'Justify:'}
            types={[{label: 'Left', value: 'left'},{label: 'Center', value: 'center'},{label: 'Right', value: 'right'}]}
            type={currentValue}
            setType={e => setColJustify({...colJustify, [column]: e})}
        />
    )
}

const RenderCustomColNameControls = ({column, customColName, setCustomColName, metadata}) => {
    if (!setCustomColName) return null;

    return (
        <div className={'w-full pt-2 mt-1 flex flex-row text-sm'}>
            <label className={'align-bottom shrink-0 pr-2 py-2 my-1 w-1/4'}> Label: </label>
            <input
                type={'text'}
                className={'align-bottom p-2 ml-0 my-1 bg-white rounded-md w-full shrink'}
                value={customColName[column] || metadata.display_name}
                placeholder={'filter by'}
                onChange={e => {
                    const tmpVal = JSON.parse(JSON.stringify(customColName));
                    if (!e.target.value) delete tmpVal[column];
                    const newValue = e.target.value ?
                        {
                            ...tmpVal,
                            ...{[column]: e.target.value ? e.target.value : undefined}
                        } : tmpVal;

                    setCustomColName(newValue)
                }
                }
            />
        </div>
    )

}
const RenderColumnBoxes = ({
                               cols,
                               anchorCols=[],
                               visibleCols=[], setVisibleCols,
                               hiddenCols=[], setHiddenCols,
                               openOutCols, setOpenOutCols,
                               colJustify, setColJustify,
                               extFilterCols, setExtFilterCols,
                               filters, setFilters,
                               filterValue, setFilterValue,
                               groupBy, setGroupBy,
                               notNull, setNotNull,
                               showTotal, setShowTotal,
                               fn, setFn,
                               sortBy, setSortBy,
                               metadata,
                               stateNamePreferences,
                               colSizes, setColSizes,
                               customColName, setCustomColName
                           }) => {
    const [list, setList] = useState([...new Set([...anchorCols, ...visibleCols])]);
    const dragItem = useRef();
    const dragOverItem = useRef();

    useEffect(() => {
        const missingAnchorCols = anchorCols.filter(ac => !visibleCols.includes(ac));
        const newList =
            missingAnchorCols?.length ?
                [...new Set([...anchorCols, ...visibleCols])] :
                visibleCols;
        setList(newList);
        setVisibleCols(newList);
    }, [anchorCols, visibleCols]);

    const dragStart = (e, position) => {
        dragItem.current = position;
        e.dataTransfer.effectAllowed = "move";
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
    };
    const dragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const drop = (e) => {
        const copyListItems = [...list];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setList(copyListItems);
        setVisibleCols(copyListItems);
    };
    return (
        <div className={'flex flex-row flex-wrap space-between px-16 my-1 text-sm'}>
            {
                list
                    .filter(c => cols.includes(c))
                    .map((col, i) => {
                        const currentMetaData = metadata.find(md => md.name === col);
                        return (
                            <div
                                onDragStart={(e) => dragStart(e, i)}
                                onDragEnter={(e) => dragEnter(e, i)}

                                onDragOver={dragOver}

                                onDragEnd={drop}
                                draggable
                                key={`col-settings-${col}`}
                                id={currentMetaData?.display_name || col}
                                className={
                                    `m-1 flex flex-col justify-between p-2 cursor-grab
                                    border border-dashed border-blue-${anchorCols.includes(col) ? `500` : `300`}
                                    rounded-md`}>
                                <div className={'font-normal w-full h-full flex flex-row justify-between'}>
                                    <label key={`label-${col}`} className={'mb-auto'}>
                                        {currentMetaData?.display_name || col}
                                    </label>
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

                                <RenderCustomColNameControls column={col}
                                                             customColName={customColName} setCustomColName={setCustomColName} metadata={currentMetaData}/>

                                <RenderFilterControls column={col}
                                                      anchorCols={anchorCols}
                                                      filters={filters} setFilters={setFilters}/>

                                <RenderFilterValueControls column={col}
                                                           filterValue={filterValue} setFilterValue={setFilterValue}/>

                                <RenderGroupControls column={col}
                                                     groupBy={groupBy} setGroupBy={setGroupBy} fn={fn}
                                                     metadata={currentMetaData}/>

                                <RenderFnControls column={col}
                                                  fn={fn} setFn={setFn} groupBy={groupBy}
                                                  metadata={currentMetaData}/>

                                <RenderSortControls column={col}
                                                    sortBy={sortBy} setSortBy={setSortBy} fn={fn}
                                                    stateNamePreferences={stateNamePreferences?.sortBy}/>

                                <RenderSizeControls column={col}
                                                    colSizes={colSizes} setColSizes={setColSizes} />

                                <RenderJustifyControls column={col}
                                                       colJustify={colJustify} setColJustify={setColJustify}/>

                                <RenderNullControls column={col}
                                                    notNull={notNull} setNotNull={setNotNull}/>

                                <RenderShowTotalControls column={col} index={i}
                                                    showTotal={showTotal} setShowTotal={setShowTotal} fn={fn}
                                                         stateNamePreferences={stateNamePreferences?.showTotal}/>

                                <RenderHideControls column={col}
                                                    hiddenCols={hiddenCols} setHiddenCols={setHiddenCols} fn={fn}
                                                    stateNamePreferences={stateNamePreferences?.hideCols}/>

                                <RenderExtFilterControls column={col}
                                                         extFilterCols={extFilterCols} setExtFilterCols={setExtFilterCols} fn={fn}
                                                         stateNamePreferences={stateNamePreferences?.hideCols}/>

                                <RenderOpenOutControls column={col}
                                                       openOutCols={openOutCols} setOpenOutCols={setOpenOutCols} fn={fn}
                                                       stateNamePreferences={stateNamePreferences?.hideCols}/>

                            </div>
                        )
                    })
            }
        </div>
    )
};

export const RenderColumnControls = (
    {
        cols = [],
        metadata = [],
        anchorCols = [],
        visibleCols = [], setVisibleCols,
        hiddenCols=[], setHiddenCols,
        filters = {}, setFilters,
        filterValue = {}, setFilterValue,
        extFilterCols={},
        setExtFilterCols,
        showTotal = [], setShowTotal,
        groupBy = [], setGroupBy,
        notNull = [], setNotNull,
        fn = {}, setFn,
        sortBy = {}, setSortBy,
        pageSize, setPageSize,
        stateNamePreferences,
        // stateNamePreferences defaults to fn[column]. to change,
        // pass {
        //     sortBy: 'original',
        //     hideCols: 'original',
        //     showTotal: 'original'
        // }
        colSizes = {}, setColSizes,
        openOutCols = [], setOpenOutCols,
        colJustify = {}, setColJustify,
        customColName = {}, setCustomColName
    }) => {

    return (
        <div>
            <div key={'shadow'} className={'shadow-md shadow-blue-100 p-1.5'}></div>

            <RenderPageSizeControl pageSize={pageSize}
                                   setPageSize={setPageSize}
            />

            <RenderColumnSelector cols={cols}
                                  anchorCols={anchorCols}
                                  visibleCols={visibleCols} setVisibleCols={setVisibleCols}
                                  metadata={metadata}
            />

            <RenderColumnBoxes cols={cols}
                               anchorCols={anchorCols}
                               visibleCols={visibleCols} setVisibleCols={setVisibleCols}
                               hiddenCols={hiddenCols} setHiddenCols={setHiddenCols}
                               extFilterCols={extFilterCols} setExtFilterCols={setExtFilterCols}
                               filters={filters} setFilters={setFilters}
                               filterValue={filterValue} setFilterValue={setFilterValue}
                               sortBy={sortBy} setSortBy={setSortBy}
                               groupBy={groupBy} setGroupBy={setGroupBy}
                               notNull={notNull} setNotNull={setNotNull}
                               showTotal={showTotal} setShowTotal={setShowTotal}
                               fn={fn} setFn={setFn}
                               metadata={metadata}
                               stateNamePreferences={stateNamePreferences}
                               colSizes={colSizes} setColSizes={setColSizes}
                               openOutCols={openOutCols} setOpenOutCols={setOpenOutCols}
                               colJustify={colJustify} setColJustify={setColJustify}
                               customColName={customColName} setCustomColName={setCustomColName}
            />
        </div>
    )
}