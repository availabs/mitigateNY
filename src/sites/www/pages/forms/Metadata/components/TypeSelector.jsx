import React from "react";
import {editMetadata} from "../utils/editMetadata.js";

export const TypeSelector = ({update, metadata, setMetadata, col, value}) => {
    const onChange = React.useCallback(async e => {
        await editMetadata({update, metadata, setMetadata, col, value: {type: e.target.value}});
    }, [col, metadata]);

    return (<select
        className="pl-3 pr-4 py-2.5 h-fit border border-blue-100 bg-blue-50 w-full bg-white mr-2 flex items-center justify-between text-sm"
        value={value}
        onChange={onChange}
    >
        <option value={null}>
            none
        </option>
        <option value="integer">
            integer
        </option>
        <option value="number">
            number
        </option>
        <option value="string">
            string
        </option>
        <option value="boolean">
            boolean
        </option>
        <option value="object">
            object
        </option>
    </select>)
}