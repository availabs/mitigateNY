import React from 'react'


import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import {useNavigate} from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
import { RenderVersions } from "../utils/macros";

const CallServer = async ({rtPfx, baseUrl, source, viewCounty={}, viewState={}, user, newVersion, navigate}) => {
    const viewMetadata = [viewState.view_id,  viewCounty.view_id];

    const url = `${rtPfx}/hazard_mitigation/load-sba`;
    const body = JSON.stringify({
        table_name: 'sba_disaster_loan_data_new',
        source_name: source.name,
        existing_source_id: source.source_id,
        version: newVersion,
        view_dependencies: JSON.stringify(viewMetadata),

        state_schema: viewState.table_schema,
        state_table: viewState.table_name,
        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,

        user_id: user.id,
        email: user.email
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

    const [versionsState, setVersionsState] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsState, type: 'tl_state'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
        }
        fetchData();
    }, [rtPfx])
    return (
        <div className='w-full'>
            {RenderVersions({value: viewState, setValue: setViewState, versions: versionsState, type: 'State'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                    rtPfx, baseUrl, source, user,
                    viewState: versionsState.views.find(v => v.view_id === parseInt(viewState)),
                    viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)), newVersion, navigate
            })}> {source.source_id ? 'Add View' : 'Add Source'}</button>
        </div>
    )
}

export default Create