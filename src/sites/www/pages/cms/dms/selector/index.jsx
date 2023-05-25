import React from "react"

import {Select} from "~/modules/avl-components/src"
import { dmsDataTypes } from "~/modules/dms/src"

import ColorBox from "../colorbox";
import LossByDisasterNumberChart from "../LossByDisasterNumberChart";
import HazardStatBox from '../HazardStatBox';

import get from "lodash/get"
import isEqual from "lodash/isEqual"

// register components here
const ComponentRegistry = {
    "ColorBox": ColorBox,
    "Chart: Loss by Disaster Number": LossByDisasterNumberChart,
    "Card: Hazard Risk": HazardStatBox,
    "lexical": dmsDataTypes.lexical
}

function EditComp (props) {
    const { value, onChange } = props
    // console.log("selector props", props, value)
    
    const updateAttribute = (k, v) => {
        if(!isEqual(value, {...value, [k]: v})){
            onChange({...value, [k]: v})
        }
        //console.log('updateAttribute', value, k, v, {...value, [k]: v})
    }
    // if(!value?.['element-type']) {
    //     onChange({...value, 'element-type': 'lexical'})
    // }
    let DataComp = ComponentRegistry[get(value, "element-type", "lexical")].EditComp


    // ComponentRegistry[get(value, "element-type", null)] ?
    //      :
    //     () => <div> Component {value?.["element-type"]} Not Registered </div>

    
    return (
        <div className="w-full">
            <div className="relative my-1">
                {/*Selector Edit*/}
                <select 
                    className='bg-slate-100 p-2 w-full border-b'
                    value={value?.['element-type'] || 'lexical'}
                    onChange={e => updateAttribute('element-type', e.target.value)}
                >
                    {Object.keys(ComponentRegistry).map(k => (
                        <option value={k} key={k}>{k}</option>
                    ))}
                </select>
            </div>
            <div>
                <DataComp
                    value={value?.['element-data'] || ''}
                    onChange={v => updateAttribute('element-data', v)}
                />
            </div>
        </div>
    )
}

function ViewComp ({value}) {
    // if (!value) return false

    let Comp = ComponentRegistry[get(value, "element-type", 'lexical')] ?
        ComponentRegistry[get(value, "element-type", "lexical")].ViewComp :
        () => <div> Component {value["element-type"]} Not Registered </div>

    return (
        <div className="relative w-full">
           <Comp value={value?.['element-data'] || ''} />
        </div>
    )
}

export default {
    EditComp,
    ViewComp
}
