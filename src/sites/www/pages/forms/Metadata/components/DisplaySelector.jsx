import React from "react";
import {falcor} from "~/modules/avl-falcor";
import {editMetadata} from "../utils/editMetadata.js";

export const DisplaySelector = ({update, metadata, setMetadata, col, value}) => {
    const onChange = React.useCallback(async e => {
        await editMetadata({update, metadata, setMetadata, col, value: {display: e.target.value}});
    }, [col, metadata]);

    return (<div className={'border'}>
        <select
            className="pl-3 pr-4 py-2.5 border border-blue-100 bg-blue-50 w-full bg-white mr-2 flex items-center justify-between text-sm"
            value={value}
            onChange={onChange}
            // disabled={value === 'calculated-column'}
        >
            <option value={""}>
                none
            </option>
            <option value="meta-variable">
                meta variable
            </option>
            <option value="data-variable">
                data variable
            </option>
            <option value="geoid-variable">
                fips variable
            </option>
            <option value="geom-variable">
                geom variable
            </option>
        </select>
    </div>)
}