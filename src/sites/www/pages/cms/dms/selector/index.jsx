import {useEffect} from "react";
import get from "lodash/get"
import isEqual from "lodash/isEqual"
import {isJson} from "~/utils/macros.jsx";
import {dmsDataTypes} from "~/modules/dms/src"

import FilterableSearch from "../../components/FilterableSearch.jsx";

import ComponentRegistry from '../ComponentRegistry'

const icons = {
    card: 'fa-thin fa-credit-card',
    table: 'fa-thin fa-table',
    graph: 'fa-thin fa-chart-column',
    map: 'fa-thin fa-map',
    'lexical': 'fa-thin fa-text'
}
// register components here

function EditComp(props) {
    const {value, onChange, size} = props
    // console.log("selector props", props, value)

    const updateAttribute = (k, v) => {
        if (!isEqual(value, {...value, [k]: v})) {
            onChange({...value, [k]: v})
        }
        //console.log('updateAttribute', value, k, v, {...value, [k]: v})
    }

    useEffect(() => {
        if (!value?.['element-type']) {
            onChange({...value, 'element-type': 'lexical'})
        }
    }, []);

    let DataComp = (ComponentRegistry[get(value, "element-type", "lexical")] || ComponentRegistry['lexical']).EditComp

    return (
        <div className="w-full">
            <div className="relative my-1">
                {/*Selector Edit*/}
                <FilterableSearch
                    className={'flex-row-reverse'}
                    placeholder={'Search for a Component...'}
                    options={
                        Object.keys(ComponentRegistry)
                            .filter(k => !ComponentRegistry[k].hideInSelector)
                            .map(k => (
                            {
                                key: k, label: ComponentRegistry[k].name || k
                            }
                        ))
                    }
                    value={value?.['element-type']}
                    onChange={async e => {
                        if (e === 'paste') {
                            return navigator.clipboard.readText()
                                .then(text => {
                                    const copiedValue = isJson(text) && JSON.parse(text || '{}')
                                    return copiedValue?.['element-type'] && onChange({...value, ...copiedValue})
                                })
                        } else {
                            updateAttribute('element-type', e)
                        }
                    }}
                    filters={[
                        {
                            icon: 'fa-thin fa-paste',
                            label: 'Paste',
                            value: 'paste'
                        },
                        ...[...new Set(
                            Object.keys(ComponentRegistry)
                                .filter(k => !ComponentRegistry[k].hideInSelector)
                                .map(key => (ComponentRegistry[key].name || key).split(':')[0]))]
                            .map(c => (
                                {
                                    icon: `${icons[c.toLowerCase()] || c.toLowerCase()}`,
                                    label: c,
                                    filterText: c
                                }
                            ))
                    ]}
                />
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

function ViewComp({value}) {
    // if (!value) return false

    let Comp = ComponentRegistry[get(value, "element-type", 'lexical')] ?
        ComponentRegistry[get(value, "element-type", "lexical")].ViewComp :
        () => <div> Component {value["element-type"]} Not Registered </div>

    return (
        <div className="relative w-full">
            <Comp value={value?.['element-data'] || ''}/>
        </div>
    )
}

const Selector = {
    EditComp,
    ViewComp
}

export default Selector
