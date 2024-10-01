import React from 'react'


import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";
import { RenderVersions } from "../utils/macros";

const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, viewNFIP, viewDDS, viewCounty, user}) => {
    const viewMetadata = [viewNFIP.view_id, viewDDS.view_id, viewCounty.view_id];

    const url = `${rtPfx}/hazard_mitigation/enhance-nfip-claims-v2`;
    const body = JSON.stringify({
        table_name: 'fima_nfip_claims_v2_enhanced',
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,

        user_id: user.id,
        email: user.email,

        nfip_schema: viewNFIP.table_schema,
        nfip_table: viewNFIP.table_name,
        dds_schema: viewDDS.table_schema,
        dds_table: viewDDS.table_name,
        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,
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

    const [viewNFIP, setViewNFIP] = React.useState();
    const [viewDDS, setViewDDS] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    const [versionsNFIP, setVersionsNFIP] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsNFIP, type: 'fima_nfip_claims_v2'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDDS, type: 'disaster_declarations_summaries_v2'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
        }
        fetchData()
    }, [rtPfx]);

    return (
        <div className='w-full'>
            {RenderVersions({value: viewNFIP, setValue: setViewNFIP, versions: versionsNFIP, type: 'NFIP'})}
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summary'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user,
                    viewNFIP: versionsNFIP.views.find(v => v.view_id === parseInt(viewNFIP)),
                    viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
                    viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)),
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create