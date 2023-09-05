import React, {useEffect, useState} from "react"
import {Select} from '~/modules/avl-components/src'
import {isJson} from "~/utils/macros.jsx";
import {RenderCalloutBox} from "./components/RenderCalloutBox.jsx";
import {ButtonSelector} from "../../components/buttonSelector.jsx";
import { dmsDataTypes } from "~/modules/dms/src"

const RenderColorPicker = ({title, className, color, setColor}) => (
    <div className={className}>
        <label className={'shrink-0 pr-2 w-1/4'}>{title}</label>
        <input id={'background'} list="colors"
               className={'rounded-md shrink'}
               type={'color'} value={color} onChange={e => setColor(e.target.value)}/>
        <datalist id="colors">
            {
                [
                    // yellows
                    '#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12',

                    // blues
                    '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'
                ].map(c => <option>{c}</option>)
            }
        </datalist>
    </div>
)

const Edit = ({value, onChange}) => {
    const cachedData = value && isJson(value) ? JSON.parse(value) : {}
    const emptyTextBlock = {text: '', size: '4xl', color: '000000'};
    const [bgColor, setBgColor] = useState(cachedData?.bgColor || 'rgba(0,0,0,0)');
    const [text, setText] = useState(cachedData?.text || value || emptyTextBlock);

    useEffect(() => {
        onChange(JSON.stringify({bgColor, text}))
    }, [bgColor, text])

    const LexicalComp = dmsDataTypes.lexical.EditComp;

    return (
        <div className='w-full'>
            <div className='relative'>
                <RenderColorPicker title={'Background: '}
                                   className={'w-full px-2 py-1 flex flex-row text-sm items-center border border-dashed'}
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

    const LexicalComp = dmsDataTypes.lexical.ViewComp;
    return (
        <div className={'pt-3'}>
            <LexicalComp value={data?.text || value} bgColor={data?.bgColor} />
        </div>
    )
}


export default {
    "name": 'Card: Callout',
    "hideInSelector": true,
    "EditComp": Edit,
    "ViewComp": View
}