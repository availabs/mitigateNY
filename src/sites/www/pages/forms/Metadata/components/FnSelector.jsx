import React from "react";
import {falcor} from "~/modules/avl-falcor";
import {editMetadata} from "../utils/editMetadata.js";

export const FnSelector = ({update, metadata, setMetadata, col, value}) => {
    const onChange = React.useCallback(async e => {
        await editMetadata({update, metadata, setMetadata, col, value: {defaultFn: e.target.value}});
    }, [col, metadata]);

    return (<div className={'border w-full h-fit'}>
        <select
            className="pl-3 pr-4 py-2.5 h-fit border border-blue-100 bg-blue-50 w-full bg-white mr-2 flex items-center justify-between text-sm"
            value={value}
            onChange={onChange}
        >
            <option value={null}>
                none
            </option>
            <option value="Sum">
                sum
            </option>
            <option value="List">
                list
            </option>
        </select>
    </div>)
}