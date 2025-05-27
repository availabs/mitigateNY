import React from 'react'


import { checkApiResponse, getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router";

import { DamaContext } from "~/pages/DataManager/store";

export const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, user, table_name, shouldFetch}) => {
    const url = `${rtPfx}/hazard_mitigation/load-ofd`;
    const body = JSON.stringify({
        table_name, // loading depends on the table name
        source_name: source.name,
        existing_source_id: source.source_id,
        version: newVersion,

        user_id: user.id,
        email: user.email,
        shouldFetch
    });

    const stgLyrDataRes = await fetch(url, {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json",
        },
    });

    await checkApiResponse(stgLyrDataRes);
    const resJson = await stgLyrDataRes.json();
    console.log('res', resJson);

    navigate(resJson.etl_context_id ? `${baseUrl}/task/${resJson.etl_context_id}` : resJson.source_id ? `${baseUrl}/source/${resJson.source_id}/versions` : baseUrl);
}

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    return (
        <div className='w-full'>
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user, table_name: 'disaster_declarations_summaries_v2'
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create