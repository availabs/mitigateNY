import React, {useState} from 'react'


import {checkApiResponse, getDamaApiRoutePrefix, getSrcViews} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
import {RenderVersions} from "../utils/macros.jsx";
const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, viewPa, viewDDS, user}) => {
    const viewMetadata = [viewPa.view_id, viewDDS.view_id];


    const url = `${rtPfx}/hazard_mitigation/enhance-pa-funded-projects-v1`
    const body = JSON.stringify({
        table_name: 'pa_funded_projects_enhanced',
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,

        user_id: user.id,
        email: user.email,

        ofd_schema: viewPa.table_schema,
        pa_table: viewPa.table_name,
        dds_table: viewDDS.table_name,
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
    const { pgEnv, user, falcor } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [viewPa, setViewPa] = useState();
    const [viewDDS, setViewDDS] = useState();

    const [versionsPa, setVersionsPa] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsPa,  type: 'public_assistance_funded_projects_details_v1'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDDS,  type: 'disaster_declarations_summaries_v2'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewPa, setValue: setViewPa, versions: versionsPa, type: 'PA'})}
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summary'})}

            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user,
                    viewPa: versionsPa.views.find(v => v.view_id === parseInt(viewPa)),
                    viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
                })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create