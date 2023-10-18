import React from "react";
import get from "lodash/get.js";
import {DisplaySelector} from "./DisplaySelector.jsx";
import {Edit} from "./Edit.jsx";
import {ManageMetaLookup} from "./MetadataLookup.jsx";
import {AddCalculatedColumn} from "./AddCalculatedColumn.jsx";
import {RemoveCalculatedColumn} from "./RemoveCalculatedColumn.jsx";
import {FnSelector} from "./FnSelector.jsx";
import {TypeSelector} from "./TypeSelector.jsx";
import {dmsDataTypes} from "~/modules/dms/src"
import {IsCurrencySwitch} from "./IsCurrencySwitch.jsx";
import {IsOpenOutSwitch} from "./openOutSwitch.jsx";


export const MetadataTable = ({meta = [], update, colOrigin}) => {
    const [metadata, setMetadata] = React.useState(meta);
    const [editing, setEditing] = React.useState(null);
    const Lexical = dmsDataTypes.lexical.ViewComp;

    const authLevel = 10;
    const gridCols =
        authLevel < 5 ? "grid-cols-3" :
            !colOrigin ? "grid-cols-5" : "grid-cols-5";

    const tableCols = [
        {name: 'Column', auth: false, Comp: () => <></>},
        {name: 'Description', auth: false},
        {name: 'Type', auth: false},
        {name: 'Display', auth: true, minAuthLevel: 5},
        {name: 'Default Fn', auth: true, minAuthLevel: 5},
        // {name: 'Delete', auth: true, minAuthLevel: 5, condition: colOrigin === 'calculated-column'},
    ]

    if (!metadata || !metadata.attributes?.length) return <div> Metadata Not Available </div>

    return (<div className="overflow-hidden">
        {authLevel > 5 && colOrigin === 'calculated-column' && <AddCalculatedColumn update={update} metadata={metadata} setMetadata={setMetadata}/>}
        <div className={`py-4 sm:py-2 sm:grid sm:${gridCols} sm:gap-4 sm:px-6 border-b-2`}>
            {
                tableCols
                    .filter(tableCol =>
                        (!tableCol.auth ||( tableCol.auth && authLevel >= tableCol.minAuthLevel)) &&
                        (!tableCol.hasOwnProperty('condition') || tableCol.condition)
                    )
                    .map((tableCol,i) => <dd key={i} className="text-sm font-medium text-gray-600 ">{tableCol.name}</dd>)
            }
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">

                {
                    metadata?.attributes
                    .filter(col => col.origin === colOrigin)
                    .map((col, i) => (
                        <div key={i} className={`py-4 sm:py-5 sm:grid sm:${gridCols} sm:gap-4 sm:px-6`}>
                            <dt className="text-sm text-gray-900">
                                <div className={'flex flex-row justify-between group'}>
                                    {editing === `${col.name}-columnName` ? <div className='pt-3 pr-8'>
                                        <Edit
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            startValue={get(col, 'name') || 'No Display Name'}
                                            attr={'name'}
                                            setEditing={setEditing}
                                            cancel={() => setEditing(null)}
                                        />
                                    </div> : <div className='truncate pt-3 pr-8'>{get(col, 'name') || 'No Name'}</div>}

                                    {authLevel > 5 && col.origin === 'calculated-column' ?
                                        <div className='hidden group-hover:block text-blue-500 cursor-pointer'
                                             onClick={e => setEditing(`${col.name}-columnName`)}>
                                            <i className="fad fa-pencil absolute -ml-12 p-2 pt-3 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white "/>
                                        </div> : ''}
                                </div>

                                <div className={'flex flex-row justify-between group'}>
                                    {editing === `${col.name}-displayName` ? <div className='pt-3 pr-8'>
                                        <Edit
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            startValue={get(col, 'display_name') || 'No Display Name'}
                                            attr={'display_name'}
                                            setEditing={setEditing}
                                            cancel={() => setEditing(null)}
                                        />
                                    </div> : <div className='pt-3 pr-8 font-bold'>{get(col, 'display_name') || 'No Display Name'}</div>}

                                    {authLevel > 5 ?
                                        <div className='hidden group-hover:block text-blue-500 cursor-pointer'
                                             onClick={e => setEditing(`${col.name}-displayName`)}>
                                            <i className="fad fa-pencil absolute -ml-12 p-2 pt-3 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white "/>
                                        </div> : ''}
                                </div>


                            </dt>

                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 flex flex-row justify-between group">
                                {editing === `${col.name}-description` ? <div className='pr-8'>
                                    <Edit
                                        update={update}
                                        type={'lexical'}
                                        metadata={metadata}
                                        setMetadata={setMetadata}
                                        col={col.name}
                                        startValue={get(col, 'desc')}
                                        attr={'desc'}
                                        setEditing={setEditing}
                                        cancel={() => setEditing(null)}
                                    />
                                </div> :
                                    <div className='pr-8'>
                                        {
                                            get(col, ['desc']) ?
                                                <textarea value={get(col, 'desc')} readOnly/> :
                                                'No Description'
                                        }
                                    </div>
                                }

                                {authLevel > 5 ?
                                    <div className='hidden group-hover:block text-blue-500 cursor-pointer'
                                         onClick={e => setEditing(`${col.name}-description`)}>
                                        <i className="fad fa-pencil absolute -ml-12 p-2 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white "/>
                                    </div> : ''}
                            </dd>


                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                {
                                    authLevel > 5 && col.origin === 'calculated-column' ?
                                    <TypeSelector
                                        update={update}
                                        metadata={metadata}
                                        setMetadata={setMetadata}
                                        col={col.name}
                                        value={col.type}
                                    /> :
                                    <div className='text-gray-400 italic'>{col.type}</div>
                                }
                                {
                                    authLevel > 5 && ['integer', 'number'].includes(col.type) ?
                                        <IsCurrencySwitch
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            value={col.isDollar}
                                        /> : null
                                }
                                {
                                    authLevel > 5 ?
                                        <IsOpenOutSwitch
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            value={col.openOut}
                                        /> : null
                                }
                            </dd>


                            {authLevel > 5 &&
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                    {
                                        // col.origin !== 'calculated-column' &&
                                        <DisplaySelector
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            value={col.display}
                                        />}
                                    {
                                        ['meta-variable', 'geoid-variable'].includes(col.display) &&
                                            <ManageMetaLookup
                                                update={update}
                                                metadata={metadata}
                                                setMetadata={setMetadata}
                                                col={col.name}
                                                startValue={get(col, 'meta_lookup') || 'No Meta Lookup Available'}
                                                attr={'meta_lookup'}
                                                setEditing={setEditing}
                                                cancel={() => setEditing(null)}
                                            />
                                    }
                                </dd>
                            }

                            {authLevel > 5 &&
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 flex flex-row">
                                    {
                                        // col.origin !== 'calculated-column' &&
                                        <FnSelector
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                            value={col.defaultFn}
                                        />}
                                    {
                                        col.origin === 'calculated-column' &&
                                        <RemoveCalculatedColumn
                                            update={update}
                                            metadata={metadata}
                                            setMetadata={setMetadata}
                                            col={col.name}
                                        />
                                    }
                                </dd>
                            }


                        </div>))}

            </dl>
        </div>
    </div>)
}
