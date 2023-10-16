import React from 'react';
import {MetadataTable} from "./components/MetadataTable.jsx";

const Advanced = ({metadata, views, update, updateAttribute}) => {
    return (
        <div className="w-full flex-1 sm:px-6 divide-y-4 grid gap-y-6 ">
            <MetadataTable meta={metadata} update={update} colOrigin={undefined}/>
            <MetadataTable meta={metadata} update={update} colOrigin={'calculated-column'}/>
        </div>
    )
}

export default Advanced
