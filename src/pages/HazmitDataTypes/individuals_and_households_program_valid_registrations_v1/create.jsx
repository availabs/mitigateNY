import React from 'react'
import { checkApiResponse, getDamaApiRoutePrefix } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router";
import {CallServer} from "../disaster_declarations_summaries_v2/create.jsx";
import { DamaContext } from "~/pages/DataManager/store";

// const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate}) => {
//     const url = new URL(
//         `${rtPfx}/hazard_mitigation/ihp_v1`
//     );
//
//     url.searchParams.append("table_name", 'individuals_and_households_program_valid_registrations_v1');
//     url.searchParams.append("source_name", source.name);
//     url.searchParams.append("existing_source_id", source.source_id);
//     url.searchParams.append("existing_view_id", '484');
//     url.searchParams.append("version", newVersion);
//
//     const stgLyrDataRes = await fetch(url);
//
//     await checkApiResponse(stgLyrDataRes);
//
//     const resJson = await stgLyrDataRes.json();
//
//     console.log('res', resJson);
//
//     navigate(`${baseUrl}/source/${resJson.payload.source_id}/versions`);
// }

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    return (
        <div className='w-full'>
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user, table_name: 'individuals_and_households_program_valid_registrations_v1', shouldFetch: true
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create