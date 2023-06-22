import React from "react"
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import {sizeOptions, getSizeClass, sizeGridTemplate, sizeOptionsSVG} from './utils/sizes.jsx'


function SizeSelect ({size='1', setSize, onChange}) {
    
    return (
        <div
          className="flex space-x-1 rounded-lg bg-slate-100 p-0.5"
          role="tablist"
          aria-orientation="horizontal"
        >        
        {sizeOptionsSVG.map((s,i) => (
            <button
                key={i}
                className={
                    s.name === size ?
                    "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow" :
                    "flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 hover:text-blue-500"
                }
                id="headlessui-tabs-tab-3"
                role="tab"
                type="button"
                tabIndex={-1}
                onClick={() => {
                    // console.log('change',s.name)
                    onChange(s.name) 
                }}
              >
                {/*<i className={`${s.icon} `} />*/}
                {s.icon}
              </button>
        ))}
        </div>
    )
} 

function SectionEdit ({value, onChange, attributes, size, onCancel, onSave, onRemove}) {
    // console.log('SectionEdit', value, attributes)

    const updateAttribute = (k, v) => {
        if(!isEqual(value, {...value, [k]: v})) {
            // console.log('onChange', k, v)
            onChange({...value, [k]: v})
        }
        //console.log('updateAttribute', value, k, v, {...value, [k]: v})
    }
    

    let TitleComp = attributes?.title?.EditComp
    let TagsComp = attributes?.tags?.EditComp 
    let ElementComp = attributes?.element?.EditComp

    return (
        <div>
            <div className='flex flex-wrap border-y justify-end'>
                <div className='flex-1 '>
                    <TitleComp 
                        className='p-2 w-full font-sans font-medium text-md uppercase'
                        placeholder={'Section Title'}
                        value={value?.['title']} 
                        onChange={(v) => updateAttribute('title', v)}
                    />
                </div>
                <div>
                    <TagsComp 
                        className='p-2'
                        value={value?.['tags']}
                        placeholder={'Add Tag...'} 
                        onChange={(v) => updateAttribute('tags', v)}
                    />
                </div>
                <div className={'self-center'}>
                    <SizeSelect 
                        size={value?.['size']} 
                        onChange={v => updateAttribute('size',v)}
                    />
                </div>
                <div className={'flex flex-row flex-wrap'}>
                    <div className='py-2'>
                        <button
                            className={'pl-6 py-0.5 text-md cursor-pointer hover:text-red-500 text-slate-400'}
                            onClick={onRemove}
                        ><i className="fa-light fa-trash text-2xl fa-fw" title="Cancel"/></button>
                    </div>
                    <div className='py-2'>
                        <button
                            className={'pl-6 py-0.5 text-md cursor-pointer hover:text-red-500 text-slate-400'}
                            onClick={onCancel}
                        ><i className="fa-light fa-xmark text-2xl fa-fw" title="Cancel"/></button>
                    </div>
                    <div className='py-2'>
                        <button
                            id={'btn-copy-component'}
                            className={'' +
                                'pl-6 py-0.5 text-md cursor-pointer flex items-center ' +
                                'hover:text-blue-500 focus:text-green-400 text-slate-400'}
                            onClick={() => navigator.clipboard.writeText(JSON.stringify(value?.['element'] || '{}'))}
                        ><i className="fa-light fa-copy text-2xl fa-fw" title="Copy"/>  </button>
                    </div>
                    <div className='py-2'>
                        <button
                            className={'pl-6 py-0.5 text-md cursor-pointer flex items-center hover:text-blue-500 text-slate-400'}
                            onClick={onSave}
                        ><i className="fa-light fa-floppy-disk text-2xl fa-fw" title="Save"/>  </button>
                    </div>
                </div>
            </div>
            <div>
                <ElementComp 
                    value={value?.['element']} 
                    onChange={(v) => updateAttribute('element', v)}
                    size={size}
                />
            </div>
        </div>
    )
}

function SectionView ({value, attributes, edit, onEdit}) {
    let TitleComp = attributes?.title?.ViewComp
    let TagsComp = attributes?.tags?.ViewComp 
    let ElementComp = attributes?.element?.ViewComp

    return (
        <div>
            {
                (value?.['title'] || value?.['tags'] || edit) && (
                    <div className={`flex border-y h-[50px] items-center mt-4`}>
                        <div id={`#${value?.title?.replace(/ /g, '_')}`} className='flex-1 py-2 px-6 font-sans font-medium text-md uppercase scroll-mt-36'>
                            <TitleComp
                                className='w-full'
                                value={value?.['title']}
                            />
                        </div>
                        <div className='p-2'>
                            <TagsComp
                                className=''
                                value={value?.['tags']}
                            />
                        </div>
                        { typeof onEdit === 'function' ?
                            <div className='py-2'>
                                <button
                                    className={'pl-6 py-0.5 flex items-center text-md cursor-pointer hover:text-blue-500 text-slate-400'}
                                    onClick={ onEdit }
                                >
                                    <i className="fa-light fa-pencil text-xl fa-fw" title="Edit"></i>
                                    {/*☳ Edit*/}
                                </button>

                            </div> : ''
                        }
                    </div>
                )
            }
            <div>
                <ElementComp value={value?.['element']} />
            </div>
        </div>
    )
}  


const AddSectionButton = ({onClick}) => (
    <div className='flex'>
        <div className='flex-1'/>
        <div>
            <button 
                className={'pl-6 py-0.5 text-lg cursor-pointer hover:text-blue-500 text-slate-400'}
                onClick={onClick}
            > 
            <i className="fa-light fa-sharp fa-layer-plus text-2xl fa-fw" title="Add Section"></i>
            {/*☷ Add Section*/}
            </button>
        </div>
    </div>
)

const Edit = ({Component, value, onChange, attr}) => {
    if (!value || !value.map) { 
        value = []
    }
    const [values, setValues] = React.useState([...value , ''] || [''])
    const [edit, setEdit] = React.useState({
        index: -1,
        value: '',
        type: 'new'
    })

    const setEditValue = (v) => setEdit({...edit, value: v})
    const setEditIndex = (i) => setEdit({...edit, index: i})
    
    const cancel = () => {
       setEdit({index: -1, value:'',type:'new'}) 
    }

    const save = () => {
        let cloneValue = cloneDeep(value)
        if(edit.type === 'update') {
            cloneValue[edit.index] = edit.value
        } else {
            cloneValue.splice(edit.index, 0, edit.value)
        }
        cancel()
        onChange(cloneValue)
    }

    const remove = () => {
        let cloneValue = cloneDeep(value)
        if(edit.type === 'update') {
            cloneValue.splice(edit.index, 1)
        }
        cancel()
        onChange(cloneValue)
    }

    const update = (i) => {
        setEdit({index: i, value:value[i],type:'update'})
    }

    return (
        <div className={`mb-12 grid grid-cols-6 lg:grid-cols-[1fr_repeat(6,_minmax(_100px,_170px))_1fr]`}>
            {values.map((v,i) => {

                let prevSize = i > 0 ? values[i-1]?.size : null;
                let prevPrevSize = i > 1 ? value[i-2]?.size : null;
                const size = (edit.index === i ? edit?.value?.size : v?.size) || "1";

                return (
                    <div key={i} className={`${getSizeClass(size, prevSize, prevPrevSize)}`}>
                        {/* add to top */}
                        { edit.index === -1 && i === 0 ? 
                            <AddSectionButton onClick={() => setEditIndex(0)}/> : 
                                edit.index === -1 || i > 0 ? '' : <div className='h-[36px]' />
                        }

                        {/* edit new or existing section */}
                        {edit.index === i 
                            ? <SectionEdit 
                                value={edit.value} 
                                onChange={setEditValue}
                                onSave={save}
                                onCancel={cancel}
                                onRemove={remove}
                                attributes={attr.attributes}
                                size={size}
                            />
                            : ''
                        }
                        
                        {/* show section if not being edited */}
                        { v !== '' && !(edit.index === i && edit.type === 'update') ? 
                            <SectionView 
                                value={v} 
                                attributes={attr.attributes}
                                edit={true}
                                onEdit={ edit.index === -1 ? (e) => update(i)  : null } 
                            /> : ''}

                        {/* add section below */}
                        { edit.index == -1 && v !== '' ? 
                            <AddSectionButton onClick={() => setEditIndex(i+1)}/> : <div className='h-[36px]' />
                        }
                    </div>
                )
            })
        }
        </div>
    )
}

const View = ({Component, value, attr}) => {
    if (!value || !value.map) { return '' }
    
    return (
        <div className={`mb-12 grid grid-cols-6 lg:grid-cols-[1fr_repeat(6,_minmax(_100px,_170px))_1fr]`}   >
        { 
            value.map((v,i) =>{
                let prevSize = i > 0 ? value[i-1]?.size : null;
                let prevPrevSize = i > 1 ? value[i-2]?.size : null;
                const size = v?.size || "1";
                return (
                    <div key={i} className={`${getSizeClass(size, prevSize, prevPrevSize)}`}>
                        <SectionView
                            attributes={attr.attributes}
                            key={i}
                            value={v}
                        />
                    </div>
                )
            })
        }
        </div>
    )
}

export default {
    "EditComp": Edit,
    "ViewComp": View
}