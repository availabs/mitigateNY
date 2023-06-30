import React, {useEffect, useState} from "react"
import {Select} from '~/modules/avl-components/src'
import {isJson} from "~/utils/macros.jsx";
import {RenderCalloutBox} from "./components/RenderCalloutBox.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import { dmsDataTypes } from "~/modules/dms/src"

const RenderColorPicker = ({title, className, color, setColor}) => (
    <div className={className}>
        <label className={'shrink-0 pr-2 py-2 my-1 w-1/4'}>{title}</label>
        <input id={'background'} className={'my-1 rounded-md shrink'}
               type={'color'} value={color} onChange={e => setColor(e.target.value)}/>
    </div>
)

const Edit = ({value, onChange}) => {
    const cachedData = value && isJson(value) ? JSON.parse(value) : {}
    const emptyTextBlock = {text: '', size: '4xl', color: '000000'};
    const [bgColor, setBgColor] = useState(cachedData?.bgColor || '#94cbff');
    const [text, setText] = useState(cachedData?.text || emptyTextBlock);

    useEffect(() => {
        onChange(JSON.stringify({bgColor, text}))
    }, [bgColor, text])

    const LexicalComp = dmsDataTypes.lexical.EditComp;
    console.log('color, text', text)
    return (
        <div className='w-full'>
            <div className='relative'>
                <RenderColorPicker title={'Background: '}
                                   className={'w-full pt-2 mt-3 flex flex-row text-sm items-center'}
                                   color={bgColor} setColor={setBgColor}/>
                    <LexicalComp value={text} onChange={setText} bgColor={bgColor}/>
            </div>
        </div>
    )
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}

const View = ({value}) => {
    if (!value) return ''
    let data = typeof value === 'object' ?
        value['element-data'] :
        JSON.parse(value)
    console.log('value', value, data)
    const LexicalComp = dmsDataTypes.lexical.ViewComp;
    return (
        <div className={'pt-3'}>
            <LexicalComp value={data?.text} bgColor={data?.bgColor} />
        </div>
    )
}


export default {
    "name": 'Card: Callout',
    "EditComp": Edit,
    "ViewComp": View
}