import React, {useState} from "react";
import {falcor} from "~/modules/avl-falcor";
import {Button} from "~/modules/avl-components/src";
import {addCalculatedColumn} from "../utils/addCalculatedColumn.js";


export const AddCalculatedColumn = ({
                                  metadata, setMetadata,
                                  update,
                              }) => {
    const [value, setValue] = useState('');

    return (
        <div className={'flex w-full justify-between'}>
            <input
                placeholder={'enter column name'}
                className='p-2 w-full flex-1 px-2 border rounded-lg'
                value={value} onChange={e => setValue(e.target.value)}/>

            <Button themeOptions={{size: 'sm', color: 'primary'}}
                    onClick={e =>
                        addCalculatedColumn({
                           update,
                            falcor,
                            metadata,
                            setMetadata,
                            col: {"name": value, origin: 'calculated-column'}
                        })}>
                Add Column
            </Button>
        </div>
    )
}