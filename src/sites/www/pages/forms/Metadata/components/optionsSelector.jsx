import React, {useState} from "react";
import {Button} from "~/modules/avl-components/src";
import {RenderArray, RenderTextArea, RenderTextBox} from "./Edit.jsx";
import {value} from "lodash/seq.js";
import {editMetadata} from "../utils/editMetadata.js";
import {falcor} from "~/modules/avl-falcor";
import {isJson} from "../../../../../../utils/macros.jsx";

const RenderViewOptions = ({options}) => {
    const optionsToRender = Array.isArray(options) ? options :
        isJson(options) ? JSON.parse(options) : []

    if(!Array.isArray(optionsToRender) || Array.isArray(optionsToRender) && !optionsToRender?.length) return <div>{options}</div>;

    return (
        <div className={'flex flex-row flex-wrap'}>
            {
                optionsToRender.map(option => <div className={'border border-blue-300 p-2 m-1'}>{option?.label || option}</div>)
            }
        </div>
    )
}
export const ManageOptionsSelector = ({
                                     update,
                                     metadata, setMetadata,
                                     col,
                                     startValue,
                                     setEditing = () => {},
                                 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(typeof startValue === 'object' ? JSON.stringify(startValue) : startValue);
    console.log('value in options selector', value)
    const save = value => {
        editMetadata({
            update,
            metadata, setMetadata,
            col, value: {'options': value}
        }).then(() => {
            setEditing(null)
            setIsEditing(false)
        })
    }

    return (
        isEditing ?
            <RenderArray value={Array.isArray(value) ? value : isJson(value) ? JSON.parse(value) : []}
                         setValue={setValue}
                         save={save}
                         cancel={() => setIsEditing(false)}
            /> :
            <div className={'flex group'}>
                <label className={'py-2 text-xs'}>Options: </label>

                <div className={'px-2 text-xs flex flex-row'}>
                    <RenderViewOptions options={value}/>
                    <div className={'self-begin my-1'}>
                        <div className='group-hover:block text-blue-500 cursor-pointer'
                             onClick={e => setIsEditing(!isEditing)}>
                            <i className="hidden group-hover:block fad fa-pencil absolute p-2 hover:bg-blue-500 rounded focus:bg-blue-700 hover:text-white"/>
                        </div>
                    </div>
                </div>
            </div>
    )
}