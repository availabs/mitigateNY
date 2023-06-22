import React from "react"
import get from "lodash/get"
import isEqual from "lodash/isEqual"
import {isJson} from "~/utils/macros.jsx";
import { dmsDataTypes } from "~/modules/dms/src"

// import ColorBox from "../colorbox";
import LossByDisasterNumberChart from "../LossByDisasterNumberChart";
import LossDistributionPieChart from "../LossDistributionPieChart";
import LossByHazardTypeChart from "../LossByHazardTypeChart/index.jsx";
import LossDistributionHeroStats from "../LossDistributionHeroStats";
import DisastersTable from "../DisastersTable/index.jsx";
import DisasterInfoStats from "../DisasterInfoStats/index.jsx";
import DisasterLossStats from "../DisasterLossStats/index.jsx";
import DisasterLossTables from "../DisasterLossTables/index.jsx";
import DisasterLossMap from "../DisasterLossMap/index.jsx";
import NRIMap from "../NRIMap/index.jsx";
import HazardStatBox from '../HazardStatBox';
import NRITable from "../NRITable/index.jsx";

// register components here
const ComponentRegistry = {
    // "ColorBox": ColorBox,
    "Card: Hazard Risk": HazardStatBox,
    "Hero Stats: Loss Distribution": LossDistributionHeroStats,
    "Hero Stats: Disaster Info": DisasterInfoStats,
    "Hero Stats: Disaster Loss": DisasterLossStats,
    "Table: Disasters": DisastersTable,
    "Table: Disaster Loss": DisasterLossTables,
    "Table: NRI": NRITable,
    "Chart: Loss by Disaster Number": LossByDisasterNumberChart,
    "Graph: Historic Loss by Hazard Type": LossByHazardTypeChart,
    "Chart: Loss Distribution Pie Chart": LossDistributionPieChart,
    "Map: FEMA Disaster Loss": DisasterLossMap,
    "Map: NRI": NRIMap,
    "lexical": dmsDataTypes.lexical
}

function EditComp (props) {
    const { value, onChange, size } = props
    // console.log("selector props", props, value)
    
    const updateAttribute = (k, v) => {
        if(!isEqual(value, {...value, [k]: v})){
            onChange({...value, [k]: v})
        }
        //console.log('updateAttribute', value, k, v, {...value, [k]: v})
    }
    if(!value?.['element-type']) {
        onChange({...value, 'element-type': 'lexical'})
    }
    let DataComp = ComponentRegistry[get(value, "element-type", "lexical")].EditComp


    // ComponentRegistry[get(value, "element-type", null)] ?
    //      :
    //     () => <div> Component {value?.["element-type"]} Not Registered </div>

    
    return (
        <div className="w-full">
            <div className="relative my-1">
                {/*Selector Edit*/}
                <select 
                    className='bg-slate-100 p-2 w-full border-b rounded-md'
                    value={value?.['element-type'] || 'lexical'}
                    onChange={async e => {
                        if(e.target.value === 'paste'){
                            return navigator.clipboard.readText()
                                .then(text => {
                                    const copiedValue = isJson(text) && JSON.parse(text || '{}')
                                    return copiedValue?.['element-type'] && onChange({...value, ...copiedValue})
                                })
                        }else {
                            updateAttribute('element-type', e.target.value)
                        }
                    }}
                >
                    <option key={'paste'} value={'paste'}>Paste from Clipboard</option>
                    {Object.keys(ComponentRegistry).map(k => (
                        <option value={k} key={k}>{ComponentRegistry[k].name || k}</option>
                    ))}
                </select>
            </div>
            <div>
                <DataComp
                    value={value?.['element-data'] || ''}
                    onChange={v => updateAttribute('element-data', v)}
                    size={size}
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
