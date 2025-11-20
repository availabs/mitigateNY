import React, {useState} from 'react'


import {checkApiResponse, getDamaApiRoutePrefix, getSrcViews} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
import {RenderVersions} from "../utils/macros.jsx";
const CallServer = async ({rtPfx, baseUrl, source, newVersion, user, navigate, viewHmgp, viewDDS}) => {
    const viewMetadata = [viewHmgp.view_id, viewDDS.view_id];
    const url =  `${rtPfx}/hazard_mitigation/enhance-hma-projects-v4`
    const body = JSON.stringify({
        table_name: 'hma_projects_enhanced',
        source_name: source.name,
        existing_source_id: source.source_id,
        version: newVersion,
        view_dependencies: JSON.stringify(viewMetadata),

        ofd_schema: viewHmgp.table_schema,
        hmgp_table: viewHmgp.table_name,
        dds_table: viewDDS.table_name,

        user_id: user.id,
        email: user.email,

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

const Create = ({ source, newVersion, baseUrl, context }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(context || DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [viewHmgp, setViewHmgp] = useState();
    const [viewDDS, setViewDDS] = useState();

    const [versionsHmgp, setVersionsHmgp] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsHmgp,  type: 'hazard_mitigation_assistance_projects_v4'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDDS,  type: 'disaster_declarations_summaries_v2'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewHmgp, setValue: setViewHmgp, versions: versionsHmgp, type: 'HMGP'})}
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summary'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user,
                    viewHmgp: versionsHmgp.views.find(v => v.view_id === parseInt(viewHmgp)),
                    viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create