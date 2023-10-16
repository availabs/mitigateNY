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
            <div className={'text-xs font-thin flex flex-col'}>
                <div className={'self-end my-1'}>
                    <Button themeOptions={{size: 'xs', color: 'transparent'}}
                            onClick={e => setIsEditing(!isEditing)}> Edit </Button>
                </div>
                <div className={'h-20 overflow-auto  border border-4 border-dotted p-1'}>
                    {
                        value
                    }
                </div>
            </div>
    )
}