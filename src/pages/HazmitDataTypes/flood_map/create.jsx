import React, { useState } from 'react'

import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi.js";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
import { RenderVersions, RenderCheckbox, RenderMultiVersions } from "../utils/macros.jsx";

const CallServer = async ({ rtPfx, baseUrl, source, newVersion, navigate, viewBle, viewNfhl, viewq3, viewPreliminary, user }) => {
    const viewMetadata = [
        viewBle?.view_id,
        viewNfhl?.view_id,
        viewq3.view_id,
        ...(viewPreliminary || []).map(v => v.view_id)
    ];

    viewPreliminary = viewPreliminary.map(vp => ({
        schema: vp?.table_schema,
        table_name: vp?.table_name
    }));

    const url = `${rtPfx}/hazard_mitigation/flood-map`;

    const body = JSON.stringify({
        source_name: source.name,
        source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,

        user_id: user.id,
        email: user.email,

        q3_schema: viewq3?.table_schema,
        q3_table: viewq3?.table_name,

        nhfl_schema: viewNfhl?.table_schema,
        nhfl_table: viewNfhl?.table_name,

        ble_schema: viewBle?.table_schema,
        ble_table: viewBle?.table_name,

        preliminary_tables: viewPreliminary
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

    navigate(
        resJson.etl_context_id
            ? `${baseUrl}/task/${resJson.etl_context_id}`
            : resJson.source_id
                ? `${baseUrl}/source/${resJson.source_id}/versions`
                : baseUrl
    );
}

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext);
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const [viewNfhl, setViewNfhl] = React.useState();
    const [viewq3, setViewq3] = React.useState();
    const [viewBle, setViewBle] = React.useState();
    const [viewPreliminary, setViewPreliminary] = React.useState([]);
    const [ismergeQ3InNHFL, setIsmergeQ3InNHFL] = useState(true);

    const [versionsNfhl, setVersionsNfhl] = React.useState({ sources: [], views: [] });
    const [versionsQ3, setVersionsQ3] = React.useState({ sources: [], views: [] });
    const [versionsBle, setVersionsBle] = React.useState({ sources: [], views: [] });
    const [versionsPreliminary, setVersionsPreliminary] = React.useState({ sources: [], views: [] });

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({ rtPfx, falcor, pgEnv, setVersions: setVersionsBle, type: 'ble' });
            await getSrcViews({ rtPfx, falcor, pgEnv, setVersions: setVersionsNfhl, type: 'nfhl' });
            await getSrcViews({ rtPfx, falcor, pgEnv, setVersions: setVersionsQ3, type: 'q3' });
            await getSrcViews({ rtPfx, falcor, pgEnv, setVersions: setVersionsPreliminary, type: 'preliminary' });
        }
        fetchData();
    }, [rtPfx]);
    
    return (
        <div className='w-full'>
            {RenderVersions({ value: viewBle, setValue: setViewBle, versions: versionsBle, type: 'ble' })}
            {RenderVersions({ value: viewNfhl, setValue: setViewNfhl, versions: versionsNfhl, type: 'nfhl' })}
            {RenderVersions({ value: viewq3, setValue: setViewq3, versions: versionsQ3, type: 'q3' })}
            {RenderMultiVersions({
                value: viewPreliminary,
                setValue: setViewPreliminary,
                versions: versionsPreliminary,
                type: 'preliminary'
            })}
            {RenderCheckbox({
                label: "Enable Post-Processing for Rensselaer and Jefferson County: ",
                checked: ismergeQ3InNHFL,
                setChecked: setIsmergeQ3InNHFL
            })}

            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() => CallServer({
                    rtPfx,
                    baseUrl,
                    source,
                    newVersion,
                    navigate,
                    user,
                    ismergeQ3InNHFL,
                    viewBle: versionsBle.views.find(v => v.view_id === parseInt(viewBle)),
                    viewNfhl: versionsNfhl.views.find(v => v.view_id === parseInt(viewNfhl)),
                    viewq3: versionsQ3.views.find(v => v.view_id === parseInt(viewq3)),
                    viewPreliminary: versionsPreliminary.views.filter(v => viewPreliminary.includes(v.view_id))
                })}
            >
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    );
}

export default Create;
