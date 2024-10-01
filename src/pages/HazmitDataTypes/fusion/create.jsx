import React from 'react'
import { useNavigate } from "react-router-dom";
import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import { RenderVersions } from "../utils/macros"

import { DamaContext } from "~/pages/DataManager/store";

const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, user,
                              viewDL = {}, viewNCEIE = {}, viewCounty = {}
                          }) => {
    const viewMetadata = [
        viewDL.view_id, viewNCEIE.view_id, viewCounty.view_id
    ];

    const url = `${rtPfx}/hazard_mitigation/load-fusion`;
    const body = JSON.stringify({
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,
        table_name: 'fusion',

        user_id: user.id,
        email: user.email,

        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,

        dl_table: viewDL.table_name,
        dl_schema: viewDL.table_schema,

        nceie_table: viewNCEIE.table_name,
        nceie_schema: viewNCEIE.table_schema
    });

    const stgLyrDataRes = await fetch(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    await checkApiResponse(stgLyrDataRes);
    const resJson = await stgLyrDataRes.json();
    console.log('res', resJson);

    navigate(resJson.etl_context_id ? `${baseUrl}/task/${resJson.etl_context_id}` : resJson.source_id ? `${baseUrl}/source/${resJson.source_id}/versions` : baseUrl);
}

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)

    // selected views/versions
    const [viewDL, setViewDL] = React.useState();
    const [viewNCEIE, setViewNCEIE] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    // all versions
    const [versionsDL, setVersionsDL] = React.useState({sources:[], views: []});
    const [versionsNCEIE, setVersionsNCEIE] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});

    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDL, type: 'disaster_loss_summary_v2'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsNCEIE, type: 'ncei_storm_events_enhanced'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewDL, setValue: setViewDL, versions: versionsDL, type: 'Open Fema Data'})}
            {RenderVersions({value: viewNCEIE, setValue: setViewNCEIE, versions: versionsNCEIE, type: 'NCEI Enhanced'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() =>
                    CallServer(
                        {rtPfx, baseUrl, source, newVersion, user,
                            viewDL: versionsDL.views.find(v => v.view_id === parseInt(viewDL)),
                            viewNCEIE: versionsNCEIE.views.find(v => v.view_id === parseInt(viewNCEIE)),
                            viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)),
                            navigate
                        })}>
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    )
}

export default Create