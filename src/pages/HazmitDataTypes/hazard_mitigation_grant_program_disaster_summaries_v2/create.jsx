import React from 'react'
import { getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import { CallServer } from "../disaster_declarations_summaries_v2/create.jsx";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    return (
        <div className='w-full'>
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user, table_name: 'hazard_mitigation_grant_program_disaster_summaries_v2'
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create