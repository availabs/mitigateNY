import React from "react"
import { Select } from '~/modules/avl-components/src'
import { HazardStatBox } from './HazardStatBox'

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const Edit = ({value, onChange}) => {
    //console.log('props', props)
    let data = value && isJson(value) ? JSON.parse(value) : {}
    const ColorSelect = (v) => {
        let newValue = Object.assign({}, data, {'color': v})
        onChange(JSON.stringify(newValue))
    }
    return (
        <div className='w-full'>
            <div className='relative'>
                Hazard Stat Box Editor
                
                <div className='relative w-full p-1'>
                    <HazardStatBox 
                        geoid={'36'} 
                        hazard={'riverine'} 
                        eal_source_id={'229'} 
                        eal_view_id={'653'}
                        isTotal={true}
                    />
                </div>
            </div>
        </div>
    )
}


const View = ({value}) => {
    // if(!value) return ''
    // console.log('value', value)
    
    return (
        <div className='relative w-full  py-2 px-8'>
            <HazardStatBox 
                geoid={'36'} 
                hazard={'riverine'} 
                eal_source_id={'229'} 
                eal_view_id={'653'}
                isTotal={true}
            />
        </div>
    )           
}


export default {
    "name": 'Hazard Risk Card',
    "EditComp": Edit,
    "ViewComp": View
}