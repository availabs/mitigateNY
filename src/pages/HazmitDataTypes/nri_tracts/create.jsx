import React from 'react'
import { getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router-dom";
import {CallServer} from "../nri/create.jsx";
import { DamaContext } from "~/pages/DataManager/store";

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    return (
        <div className='w-full'>
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user, table_name: 'nri_tracts', geo_type: 'tract'
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create