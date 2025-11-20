import React from 'react'


import { checkApiResponse, getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import { getType } from "../utils/macros";
import {useNavigate} from "react-router";
import {CallServer} from "../disaster_declarations_summaries_v2/create.jsx";
import { DamaContext } from "~/pages/DataManager/store";

const Create = ({ source, newVersion, baseUrl, context }) => {
    const navigate = useNavigate();
    const { pgEnv, user } = React.useContext(context || DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    return (
        <div className='w-full'>
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user, table_name: getType(source, 'fima_nfip_claims_v2'), shouldFetch: true
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create