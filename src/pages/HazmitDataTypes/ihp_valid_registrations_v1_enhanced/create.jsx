import React, {useState} from 'react'


import {checkApiResponse, getDamaApiRoutePrefix, getSrcViews} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";
import {RenderVersions} from "../utils/macros.jsx";
const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, viewIHP, viewState, viewCounty, user}) => {
    const viewMetadata = [viewIHP.view_id, viewState.view_id, viewCounty.view_id];


    const url = `${rtPfx}/hazard_mitigation/enhance-ihp`
    const body = JSON.stringify({
        table_name: 'ihp_valid_registrations_enhanced',
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,

        user_id: user.id,
        email: user.email,

        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,

        state_schema: viewState.table_schema,
        state_table: viewState.table_name,

        ihp_schema: viewIHP.table_schema,
        ihp_table: viewIHP.table_name
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

    const [viewState, setViewState] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    const [viewIHP, setViewIHP] = React.useState();

    const [versionsState, setVersionsState] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});
    const [versionsIHP, setVersionsIHP] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsIHP,  type: 'individuals_and_households_program_valid_registrations_v1'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsState, type: `tl_state`});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewIHP, setValue: setViewIHP, versions: versionsIHP, type: 'IHP'})}
            {RenderVersions({value: viewState, setValue: setViewState, versions: versionsState, type: 'State'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}

            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                rtPfx, baseUrl, source, newVersion, navigate, user,
                    viewIHP: versionsIHP.views.find(v => v.view_id === parseInt(viewIHP)),
                    viewState: versionsState.views.find(v => v.view_id === parseInt(viewState)),
                    viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)),
                })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create