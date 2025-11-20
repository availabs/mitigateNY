import React from 'react'
import { useNavigate } from "react-router";
import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import { RenderVersions } from "../utils/macros"

import { DamaContext } from "~/pages/DataManager/store";

const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, user,
                              viewFusion = {}, viewCounty = {}
                          }) => {
    const viewMetadata = [
        viewFusion.view_id, viewCounty.view_id
    ];

    const url = `${rtPfx}/hazard_mitigation/load-sheldus`;
    const body = JSON.stringify({
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,
        table_name: 'sheldus',

        user_id: user.id,
        email: user.email,

        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,

        fusion_table: viewFusion.table_name,
        fusion_schema: viewFusion.table_schema,
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

const Create = ({ source, newVersion, baseUrl, context }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(context || DamaContext)

    // selected views/versions
    const [viewFusion, setViewFusion] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    // all versions
    const [versionsFusion, setVersionsFusion] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});

    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsFusion, type: 'fusion'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewFusion, setValue: setViewFusion, versions: versionsFusion, type: 'Fusion'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() =>
                    CallServer(
                        {rtPfx, baseUrl, source, newVersion, user,
                            viewFusion: versionsFusion.views.find(v => v.view_id === parseInt(viewFusion)),
                            viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)),
                            navigate
                        })}>
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    )
}

export default Create