import React, {useState} from 'react'


import {checkApiResponse, getDamaApiRoutePrefix, getSrcViews} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";
import {RenderVersions} from "../utils/macros.jsx";
const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, viewHmgp, viewDDS}) => {
    const viewMetadata = [viewHmgp.view_id, viewDDS.view_id];


    const url = new URL(
        `${rtPfx}/hazard_mitigation/hmgp_projects_v2_enhanced`
    );

    url.searchParams.append("table_name", 'hazard_mitigation_assistance_projects_enhanced');
    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.source_id);
    url.searchParams.append("view_dependencies", JSON.stringify(viewMetadata));
    url.searchParams.append("version", newVersion);

    url.searchParams.append("ofd_schema", viewHmgp.table_schema);
    url.searchParams.append("hmgp_table", viewHmgp.table_name);
    url.searchParams.append("dds_table", viewDDS.table_name);

    const stgLyrDataRes = await fetch(url);

    await checkApiResponse(stgLyrDataRes);

    const resJson = await stgLyrDataRes.json();

    console.log('res', resJson);

    navigate(`${baseUrl}/source/${resJson.payload.source_id}/versions`);
}

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [viewHmgp, setViewHmgp] = useState();
    const [viewDDS, setViewDDS] = useState();

    const [versionsHmgp, setVersionsHmgp] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, setVersions: setVersionsHmgp,  type: 'hazard_mitigation_assistance_projects_v3'});
            await getSrcViews({rtPfx, setVersions: setVersionsDDS,  type: 'disaster_declarations_summaries_v2'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewHmgp, setValue: setViewHmgp, versions: versionsHmgp, type: 'HMGP'})}
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summary'})}
            <button
                className={`align-right p-2 border-2 border-gray-200`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate,
                    viewHmgp: versionsHmgp.views.find(v => v.view_id === parseInt(viewHmgp)),
                    viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
            })}> Add New Source</button>
        </div>
    )
}

export default Create