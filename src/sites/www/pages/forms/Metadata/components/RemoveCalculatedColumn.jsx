import React from "react";
import {falcor} from "~/modules/avl-falcor";
import {Button} from "~/modules/avl-components/src";
import {removeCalculatedColumn} from "../utils/removeCalculatedColumn.js";


export const RemoveCalculatedColumn = ({
                                           col, // column name
                                           metadata, setMetadata,
                                           update,
                              }) => {
    return (
        <div className={'float-right'}>
            <Button themeOptions={{size: 'xs', color: 'cancel'}}
                    onClick={e =>
                        removeCalculatedColumn({
                           update,
                            metadata,
                            setMetadata,
                            col
                        })}>
                <i className={'fad fa-trash p-2 pt-3 rounded'} />
            </Button>
        </div>
    )
}