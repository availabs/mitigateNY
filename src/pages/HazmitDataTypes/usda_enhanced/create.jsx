import React from 'react'


import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";
import { RenderVersions } from "../utils/macros";

const CallServer = async ({rtPfx, baseUrl, source, table, newVersion, navigate, viewUSDA, viewDDS, user}) => {
    const viewMetadata = [viewUSDA.view_id, viewDDS.view_id];
    
    const url = `${rtPfx}/hazard_mitigation/enhance-usda`;
    const body = JSON.stringify({
        table_name: table,
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,

        usda_schema: viewUSDA.table_schema,
        usda_table: viewUSDA.table_name,
        dds_schema: viewDDS.table_schema,
        dds_table: viewDDS.table_name,
        user_id: user.id,
        email: user.email,
    })
    
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

const Create =  ({ source, newVersion, baseUrl })=> {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [viewUSDA, setViewUSDA] = React.useState();
    const [viewDDS, setViewDDS] = React.useState();
    const [versionsUSDA, setVersionsUSDA] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsUSDA, type: 'usda_crop_insurance_cause_of_loss'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDDS, type: 'disaster_declarations_summaries_v2'});

        }
        fetchData()
    }, [rtPfx]);
    
    return (
        <div className='w-full'>
            {RenderVersions({value: viewUSDA, setValue: setViewUSDA, versions: versionsUSDA, type: 'USDA'})}
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summary'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, table: 'usda_crop_insurance_cause_of_loss_enhanced', newVersion, navigate, user,
                    viewUSDA: versionsUSDA.views.find(v => v.view_id === parseInt(viewUSDA)),
                    viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
                })}> {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    )
}

export default Create