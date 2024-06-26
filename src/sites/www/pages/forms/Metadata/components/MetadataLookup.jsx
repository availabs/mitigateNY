import React, {useState} from "react";
import {Button} from "~/modules/avl-components/src";
import {RenderTextArea, RenderTextBox} from "./Edit.jsx";
import {value} from "lodash/seq.js";
import {editMetadata} from "../utils/editMetadata.js";
import {falcor} from "~/modules/avl-falcor";

export const ManageMetaLookup = ({
                                     update,
                                     metadata, setMetadata,
                                     col,
                                     startValue,
                                     setEditing = () => {},
                                 }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(typeof startValue === 'object' ? JSON.stringify(startValue) : startValue);

    const save = value => {
        editMetadata({
            update,
            metadata, setMetadata,
            col, value: {'meta_lookup': value}
        }).then(() => {
            setEditing(null)
            setIsEditing(false)
        })
    }

    return (
        isEditing ?
            <RenderTextBox value={value} setValue={setValue} save={save} cancel={() => setIsEditing(false)}/> :
            <div className={'flex group'}>
                <label className={'py-2 text-xs'}>Meta: </label>

                <div className={'px-2 text-xs flex flex-row'}>
                    <div className={'h-20 overflow-auto  border border-4 border-dotted p-1'}>
                        {
                            value
                        }
                    </div>
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