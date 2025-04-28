import React from 'react'
import {useNavigate} from "react-router-dom";
import { checkApiResponse, getDamaApiRoutePrefix, getSrcViews } from "../utils/DamaControllerApi";
import { RenderVersions, range } from "../utils/macros"
import { DamaContext } from "~/pages/DataManager/store";

const CallServer = async ({rtPfx, baseUrl, source, user, newVersion, navigate, startYear, endYear,
                              viewNCEI={},viewZTC={}, viewCousubs={}, viewCounty={}, viewState={}, viewTract={}}) => {
    const viewMetadata = [viewZTC.view_id, viewState.view_id,  viewCounty.view_id, viewCousubs.view_id, viewTract.view_id, viewNCEI.view_id];

    const url = `${rtPfx}/hazard_mitigation/enhance-ncei`;
    const body = JSON.stringify({
        table_name: 'details_enhanced',
        source_name: source.name,
        existing_source_id: source.source_id,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,
        start_year: startYear,
        end_year: endYear,

        user_id: user.id,
        email: user.email,

        ncei_schema: viewNCEI.table_schema,
        ncei_table: viewNCEI.table_name,
        tract_schema: viewTract.table_schema,
        tract_table: viewTract.table_name,
        ztc_schema: viewZTC.table_schema,
        ztc_table: viewZTC.table_name,
        state_schema: viewState.table_schema,
        state_table: viewState.table_name,
        county_schema: viewCounty.table_schema,
        county_table: viewCounty.table_name,
        cousub_schema: viewCousubs.table_schema,
        cousub_table: viewCousubs.table_name
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
};

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)

    const [startYear, setStartYear] = React.useState(1996);
    const [endYear, setEndYear] = React.useState(new Date().getFullYear() - 1);
    const years = range(1996, new Date().getFullYear()).reverse();

    // selected views/versions
    const [viewZTC, setViewZTC] = React.useState();
    const [viewCousubs, setViewCousubs] = React.useState();
    const [viewTract, setViewTract] = React.useState();
    const [viewState, setViewState] = React.useState();
    const [viewCounty, setViewCounty] = React.useState();
    const [viewNCEI, setViewNCEI] = React.useState();
    // all versions
    const [versionsZTC, setVersionsZTC] = React.useState({sources:[], views: []});
    const [versionsCousubs, setVersionsCousubs] = React.useState({sources:[], views: []});
    const [versionsTract, setVersionsTract] = React.useState({sources:[], views: []});
    const [versionsState, setVersionsState] = React.useState({sources:[], views: []});
    const [versionsCounty, setVersionsCounty] = React.useState({sources:[], views: []});
    const [versionsNCEI, setVersionsNCEI] = React.useState({sources:[], views: []});

    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    React.useEffect(() => {
        async function fetchData() {
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsZTC, type: 'zone_to_county'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCousubs, type: 'tl_cousub'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsTract, type: 'tl_tract'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsState, type: 'tl_state'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsCounty, type: 'tl_county'});
            await getSrcViews({rtPfx, falcor, pgEnv, setVersions: setVersionsNCEI, type: 'ncei_storm_events'});
        }
        fetchData();
    }, [rtPfx])

    return (
        <div className='w-full'>
            {RenderVersions({value: startYear, setValue: setStartYear, versions: [startYear], type: 'Start Year'})}
            {RenderVersions({value: endYear, setValue: setEndYear, versions: years, type: 'End Year'})}
            {RenderVersions({value: viewNCEI, setValue: setViewNCEI, versions: versionsNCEI, type: 'NCEI Storm Events'})}
            {RenderVersions({value: viewZTC, setValue: setViewZTC, versions: versionsZTC, type: 'Zone to County'})}
            {RenderVersions({value: viewState, setValue: setViewState, versions: versionsState, type: 'State'})}
            {RenderVersions({value: viewCounty, setValue: setViewCounty, versions: versionsCounty, type: 'County'})}
            {RenderVersions({value: viewCousubs, setValue: setViewCousubs, versions: versionsCousubs, type: 'Cousubs'})}
            {RenderVersions({value: viewTract, setValue: setViewTract, versions: versionsTract, type: 'Tracts'})}
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() =>
                    CallServer(
                        {rtPfx, baseUrl, source, user,
                            startYear, endYear,
                            viewNCEI: versionsNCEI.views.find(v => v.view_id === parseInt(viewNCEI)),
                            viewZTC: versionsZTC.views.find(v => v.view_id === parseInt(viewZTC)),
                            viewState: versionsState.views.find(v => v.view_id === parseInt(viewState)),
                            viewCounty: versionsCounty.views.find(v => v.view_id === parseInt(viewCounty)),
                            viewCousubs: versionsCousubs.views.find(v => v.view_id === parseInt(viewCousubs)),
                            viewTract: versionsTract.views.find(v => v.view_id === parseInt(viewTract)),
                            newVersion, navigate
                        })}>
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    )
}

export default Create