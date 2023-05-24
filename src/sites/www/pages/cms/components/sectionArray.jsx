import React from "react"
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

function SectionEdit ({value, onChange, attributes, onCancel, onSave}) {
    //console.log('SectionEdit', value, attributes)
    
    const updateAttribute = (k, v) => {
        if(!isEqual(value, {...value, [k]: v})){
            onChange({...value, [k]: v})
        }
        //console.log('updateAttribute', value, k, v, {...value, [k]: v})
    }
    
    let TitleComp = attributes?.title?.EditComp
    let TagsComp = attributes?.tags?.EditComp 
    let ElementComp = attributes?.element?.EditComp

    return (
        <div>
            <div className='flex border-y items-center h-[50px]'>
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
                <div className='py-2'>
                    <button 
                        className={'pl-6 py-0.5 text-md cursor-pointer hover:text-red-500 text-slate-400'}
                        onClick={onCancel}
                    ><i class="fa-light fa-xmark text-2xl fa-fw" title="Cancel"/></button>
                </div>
                <div className='py-2'>
                    <button 
                        className={'pl-6 py-0.5 text-md cursor-pointer flex items-center hover:text-blue-500 text-slate-400'}
                        onClick={onSave}
                    ><i class="fa-light fa-floppy-disk text-2xl fa-fw" title="Save"/>  </button>
                </div>
            </div>
            <div>
                <ElementComp 
                    value={value?.['element']} 
                    onChange={(v) => updateAttribute('element', v)}
                />
            </div>
        </div>
    )
}

function SectionView ({value, attributes, onEdit}) {
    let TitleComp = attributes?.title?.ViewComp
    let TagsComp = attributes?.tags?.ViewComp 
    let ElementComp = attributes?.element?.ViewComp

    return (
        <div>
            <div className='flex border-y h-[50px] items-center'>
                <div className='flex-1 py-2 px-6 font-sans font-medium text-md uppercase'>
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
                            <i class="fa-light fa-pencil text-xl fa-fw" title="Edit"></i>
                            {/*☳ Edit*/}
                        </button>
                    
                    </div> : ''
                }
            </div>
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
            <i class="fa-light fa-sharp fa-layer-plus text-2xl fa-fw" title="Add Section"></i>
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

    const update = (i) => {
        setEdit({index: i, value:value[i],type:'update'})
    }

    return (
        <div className='max-w-5xl mx-auto mb-12'>
            {values.map((v,i) => {
                return (
                    <div key={i} className=''>
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
                                attributes={attr.attributes}
                            />
                            : ''
                        }
                        
                        {/* show section if not being edited */}
                        { v !== '' && !(edit.index === i && edit.type === 'update') ? 
                            <SectionView 
                                value={v} 
                                attributes={attr.attributes} 
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
        <div className='max-w-5xl mx-auto'>
        { 
            value.map((v,i) =>(
                <div key={i}> 
                    <SectionView 
                        attributes={attr.attributes} 
                        key={i} 
                        value={v}
                    />
                </div>
            ))
        }
        </div>
    )
}

export default {
    "EditComp": Edit,
    "ViewComp": View
}