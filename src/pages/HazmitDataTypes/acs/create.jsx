import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import { DamaContext } from "~/pages/DataManager/store";
import {RenderAddNewVariables, CallServer} from "./index.jsx";

// const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, user,
//
//                           }) => {
//     const viewMetadata = [750];
//
//     const url = `${rtPfx}/acs/load`;
//
//     const body = JSON.stringify({
//         source_name: source.name,
//         existing_source_id: source.source_id,
//         existing_view_id: undefined,
//         view_dependencies: JSON.stringify(viewMetadata),
//         version: newVersion,
//         table_name: 'acs',
//         acs_schema: 'acs',
//         geo_data_table: 'tiger.tl_s360_v750',
//
//         years: [],
//         geoids: [],
//         variables: [
//             {
//             censusKeys: ["B01003_001E"], // Total Population
//             divisorKeys: null // No divisor needed
//             },
//             {
//                 censusKeys: ["B19013_001E"], // Median Household Income
//                 divisorKeys: ["B01003_001E"] // Divide by total population (if needed for per capita calculations)
//             },
//             ],
//
//         user_id: user.id,
//         email: user.email
//     });
//
//     const stgLyrDataRes = await fetch(url, {
//         method: 'POST',
//         body,
//         headers: {
//             'Content-Type': 'application/json',
//         }
//     });
//
//     await checkApiResponse(stgLyrDataRes);
//     const resJson = await stgLyrDataRes.json();
//     console.log('res', resJson);
//
//     navigate(resJson.etl_context_id ? `${baseUrl}/task/${resJson.etl_context_id}` : resJson.source_id ? `${baseUrl}/source/${resJson.source_id}/versions` : baseUrl);
// }

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [newVariables, setNewVariables] = useState([]);
    const [newVariable, setNewVariable] = useState({});
    const [loading, setLoading] = useState(false);

    return (
        <div className='w-full'>
            <RenderAddNewVariables newVariables={newVariables} setNewVariables={setNewVariables}
                                   newVariable={newVariable} setNewVariable={setNewVariable}
                                   loading={loading}
                                   serverCall={() => CallServer({rtPfx, baseUrl, source, user, navigate, newVersion, newVariables, setLoading})}
            />

            {/*<button*/}
            {/*    className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}*/}
            {/*    onClick={() =>*/}
            {/*        CallServer({rtPfx, baseUrl, source, newVersion, user, navigate})}>*/}
            {/*    {source.source_id ? 'Add View' : 'Add Source'}*/}
            {/*</button>*/}
        </div>
    )
}

export default Create