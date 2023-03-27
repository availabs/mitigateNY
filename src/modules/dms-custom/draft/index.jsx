import React from "react"
import get from 'lodash/get'
// import { useTheme } from "components/avl-components/wrappers/with-theme"
import Editor, {createEmpty} from "./editor"
import ReadOnlyEditor from "./editor/editor.read-only"

import {convertFromRaw, convertToRaw, EditorState} from 'draft-js';

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


const Edit = ({value, onChange}) => {
    let data = value ? isJson(value) ? JSON.parse(value) : value : createEmpty()
    if (value) {
        //data = data);
        data = EditorState.createWithContent(convertFromRaw(data))
    }

    return (
        <div className='w-full relative'>
            <Editor
                editorKey="foobar"
                value={!value ? createEmpty() : data}
                onChange={(e) => {
                    onChange(convertToRaw(e.getCurrentContent()))
                }}
                imgUploadUrl ={'https://graph.availabs.org/img/new'}
            />
        </div>
    )
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}

const View = ({value}) => {
    //console.log('draft view', value)
    
    let data = value ? isJson(value) ? JSON.parse(value) : value : createEmpty()
    if (value) {
        //data = data);
        data = EditorState.createWithContent(convertFromRaw(data))
    }

    return (
        <div className='relative w-full'>
            <ReadOnlyEditor value={data} />
        </div>
    )
}


export default {
    "EditComp": Edit,
    "ViewComp": View
}