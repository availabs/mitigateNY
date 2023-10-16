import React from "react";
import {falcor} from "~/modules/avl-falcor";
import {editMetadata} from "../utils/editMetadata.js";
import {Switch} from "@headlessui/react";

export const IsCurrencySwitch = ({update, metadata, setMetadata, col, value}) => {
    const onChange = React.useCallback(async e => {
        await editMetadata({update, metadata, setMetadata, col, value: {isDollar: e}});
    }, [col, metadata]);

    return (
        <div className={'block w-full flex mt-1 items-center'}>
            <label className={'align-bottom shrink py-2 my-1 text-sm'}> Is Dollar: </label>
            <div className={'align-bottom p-2 my-1 rounded-md shrink self-center'}>
                <Switch
                    key={`isDollar-${col}`}
                    checked={value || false}
                    onChange={onChange}
                    className={
                        `
                         ${value ? 'bg-indigo-600' : 'bg-gray-200' }
                         relative inline-flex 
                         h-4 w-10 shrink
                         cursor-pointer rounded-full border-2 border-transparent 
                         transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0.5
                         focus:ring-indigo-600 focus:ring-offset-2`
                    }
                >
                    <span className="sr-only">toggle is dollar by</span>
                    <span
                        aria-hidden="true"
                        className={
                        `
                            ${value ? 'translate-x-5' : 'translate-x-0'}
                            pointer-events-none inline-block 
                            h-3 w-4
                            transform rounded-full bg-white shadow ring-0
                            transition duration-200 ease-in-out
                            `
                        }
                    />
                </Switch>
            </div>
        </div>
    )
}