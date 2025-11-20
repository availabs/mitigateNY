import React from 'react'
import { useNavigate } from "react-router";
import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import { RenderVersions, getType } from "../utils/macros"

import { DamaContext } from "~/pages/DataManager/store";
import ihp_valid_registrations_v1_enhanced from "../ihp_valid_registrations_v1_enhanced/index.jsx";

const CallServer = async ({rtPfx, baseUrl, source, newVersion, navigate, 
                              viewPAFPD = {}, viewIHP = {}, 
                              viewDDS = {}, viewSBA = {}, 
                              viewNFIP = {}, viewUSDA = {}
                          }) => {
    const viewMetadata = [
        viewPAFPD.view_id, viewIHP.view_id,
        viewDDS.view_id, viewSBA.view_id,
        viewNFIP.view_id, viewUSDA.view_id
    ];

    const url = `${rtPfx}/hazard_mitigation/load-disaster-loss-summary`;
    const body = JSON.stringify({
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,
        table_name: getType(source, 'disaster_loss_summary_v2'),

        ofd_schema: viewPAFPD.table_schema,

        pafpd_table: viewPAFPD.table_name,
        pafpd_schema: viewPAFPD.table_schema,

        ihp_table: viewIHP.table_name,
        ihp_schema: viewIHP.table_schema,

        dds_table: viewDDS.table_name,
        dds_schema: viewDDS.table_schema,

        sba_table: viewSBA.table_name,
        sba_schema: viewSBA.table_schema,

        nfip_table: viewNFIP.table_name,
        nfip_schema: viewNFIP.table_schema,

        usda_table: viewUSDA.table_name,
        usda_schema: viewUSDA.table_schema
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

const range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const Create = ({ source, newVersion, baseUrl, context }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(context || DamaContext)

    // selected views/versions
    const [viewPAFPD, setViewPAFPD] = React.useState();
    const [viewIHP, setViewIHP] = React.useState();
    const [viewDDS, setViewDDS] = React.useState();
    const [viewSBA, setViewSBA] = React.useState();
    const [viewNFIP, setViewNFIP] = React.useState();
    const [viewUSDA, setViewUSDA] = React.useState();
    // all versions
    const [versionsPAFPD, setVersionsPAFPD] = React.useState({sources:[], views: []});
    const [versionsIHP, setVersionsIHP] = React.useState({sources:[], views: []});
    const [versionsDDS, setVersionsDDS] = React.useState({sources:[], views: []});
    const [versionsSBA, setVersionsSBA] = React.useState({sources:[], views: []});
    const [versionsNFIP, setVersionsNFIP] = React.useState({sources:[], views: []});
    const [versionsUSDA, setVersionsUSDA] = React.useState({sources:[], views: []});

    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsPAFPD, type: 'public_assistance_funded_projects_details_v2_enhanced'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsIHP, type: 'ihp_valid_registrations_v2_enhanced'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsDDS, type: 'disaster_declarations_summaries_v2'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsSBA, type: 'sba_disaster_loan_data_new'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsNFIP, type: 'fima_nfip_claims_v2_enhanced'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsUSDA, type: 'usda_crop_insurance_cause_of_loss_enhanced'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: viewDDS, setValue: setViewDDS, versions: versionsDDS, type: 'Disaster Declarations Summaries'})}
            {RenderVersions({value: viewIHP, setValue: setViewIHP, versions: versionsIHP, type: 'Individuals and Households Program Valid Registrations'})}
            {RenderVersions({value: viewPAFPD, setValue: setViewPAFPD, versions: versionsPAFPD, type: 'Public Assistance Funded Projects Details'})}
            {RenderVersions({value: viewSBA, setValue: setViewSBA, versions: versionsSBA, type: 'SBA Loan Data'})}
            {RenderVersions({value: viewNFIP, setValue: setViewNFIP, versions: versionsNFIP, type: 'NFIP Claims Enhanced'})}
            {RenderVersions({value: viewUSDA, setValue: setViewUSDA, versions: versionsUSDA, type: 'USDA Crop Loss Enhanced'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() =>
                    CallServer(
                        {rtPfx, baseUrl, source, newVersion,
                            viewPAFPD: versionsPAFPD.views.find(v => v.view_id === parseInt(viewPAFPD)),
                            viewIHP: versionsIHP.views.find(v => v.view_id === parseInt(viewIHP)),
                            viewDDS: versionsDDS.views.find(v => v.view_id === parseInt(viewDDS)),
                            viewSBA: versionsSBA.views.find(v => v.view_id === parseInt(viewSBA)),
                            viewNFIP: versionsNFIP.views.find(v => v.view_id === parseInt(viewNFIP)),
                            viewUSDA: versionsUSDA.views.find(v => v.view_id === parseInt(viewUSDA)),
                            navigate
                        })}>
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    )
}

export default Create