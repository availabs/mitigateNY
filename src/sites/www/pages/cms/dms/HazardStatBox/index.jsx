import React from "react"
import { Select } from '~/modules/avl-components/src'
import { HazardStatBox } from './HazardStatBox'
import { hazardsMeta } from '~/utils/colors'

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const Edit = ({value, onChange}) => {
    //let [edit,setEedit] = React.useState(value || {geoid: '36', hazard: 'total', version: '653' }) 
    if(!value.geoid) {
        // set default
        onChange({geoid: '36', hazard: 'total', version: '653' })
    }


    console.log('hazard state box', value, hazardsMeta, value.hazard === 'total')
    

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className='border border-blue-500 bg-blue-50 p-2 m-1'>
                 Hazard Stat Box Editor
                 <div className='flex'>
                    <div className='flex-1 p-2'>
                        <div>Geography</div>
                        <select 
                            className='w-full p-2 bg-white'
                            onChange={e => onChange({...value, geoid: e.target.value})}
                        > 
                            <option value='36'>New York State</option>
                            <option value='36001'>Albany County</option> 
                        </select>
                    </div>
                    <div className='flex-1 p-2'>
                        <div>Hazard</div>
                        <select className='w-full p-2 bg-white' onChange={e => onChange({...value, hazard: e.target.value})}> 
                            <option value='total'>Total</option> 
                            {
                                Object.keys(hazardsMeta).map((k,i) => {
                                   return <option value={k}>{hazardsMeta[k].name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='flex-1 p-2'>
                        <div>Version</div>
                        <select className='w-full p-2 bg-white '> 
                            <option value='653'>Version 1</option> 
                        </select>
                    </div>
                 </div>
                </div>
                <div className='relative w-full p-1'>
                    <HazardStatBox 
                        geoid={'36'} 
                        hazard={value.hazard === 'total' ? '' : value.hazard} 
                        eal_source_id={'229'} 
                        eal_view_id={'653'}
                        isTotal={value.hazard === 'total'}
                    />
                </div>
            </div>
        </div>
    )
}


const View = ({value}) => {
    // if(!value) return ''
    // console.log('value', value)
    let data = value || {geoid: '36', hazard: 'total', version: '653' }
    return (
        <div className='relative w-full  py-2 px-8'>
            <HazardStatBox 
                geoid={value.geoid} 
                hazard={value.hazard} 
                eal_source_id={'229'} 
                eal_view_id={'653'}
                isTotal={value.hazard === 'total'}
            />
        </div>
    )           
}


export default {
    "name": 'Hazard Risk Card',
    "EditComp": Edit,
    "ViewComp": View
}