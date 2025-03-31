import React, {useEffect, useMemo, useState} from "react";
import Create from "./create";
import DamaTable from "~/pages/DataManager/DataTypes/gis_dataset/pages/Table";
import {DamaContext} from "~/pages/DataManager/store";
import {Table} from "~/modules/avl-components/src";
import get from "lodash/get";
import {fnum, fnumIndex} from "../utils/macros"
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {checkApiResponse, getDamaApiRoutePrefix} from "../utils/DamaControllerApi.js";

const RenderVersions = ({domain, value, onchange}) => {
    return (
        <select
            className={`w-40 pr-4 py-3 bg-white mr-2 flex items-center text-sm`}
            value={value}
            onChange={(e) => onchange(e.target.value)
            }
        >
            <option key={'default'} value={''}>Version</option>
            {domain
                .sort((a, b) => b.view_id - a.view_id)
                .map((v, i) => (
                    <option key={i} value={v.view_id} className="ml-2  truncate">{v.version}</option>
                ))}
        </select>
    )
};

export const CallServer = async ({rtPfx, baseUrl, source, activeViewId, newVersion, navigate, user,
                            newVariables, setLoading
                          }) => {
    setLoading(true)
    const viewMetadata = [750];

    const url = `${rtPfx}/acs/load`;

    const body = JSON.stringify({
        source_name: source.name,
        existing_source_id: source.source_id,
        existing_view_id: activeViewId,
        view_dependencies: JSON.stringify(viewMetadata),
        version: newVersion,
        table_name: 'acs',
        acs_schema: 'acs',
        geo_data_table: 'tiger.tl_s360_v750',

        years: [],
        geoids: [],
        variables: newVariables,
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
    setLoading(false)
    navigate(resJson.etl_context_id ? `${baseUrl}/task/${resJson.etl_context_id}` : resJson.source_id ? `${baseUrl}/source/${resJson.source_id}/versions` : baseUrl);

}

export const RenderAddNewVariables = ({newVariable, setNewVariable, newVariables, setNewVariables, loading, serverCall}) => (
    <div className={'p-2 bg-blue-50 rounded-md'}>
        <div className={'grid grid-cols-3'}>
            <input type={'text'}
                   key={'name'}
                   placeholder={'name'}
                   className={'p-1 w-full'}
                   value={newVariable.name}
                   onChange={e => setNewVariable({...newVariable, name: e.target.value})}
            />
            <input type={'text'}
                   key={'censusKeys'}
                   placeholder={'censusKeys'}
                   className={'p-1 w-full'}
                   value={newVariable.censusKeys}
                   onChange={e => setNewVariable({...newVariable, censusKeys: e.target.value.split(',').map(k => k.trim())})}
            />
            <button key={'btn'}
                    className={'px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-500 rounded-md'}
                    onClick={() => setNewVariables([...newVariables, newVariable])}
            >add</button>
        </div>

        { newVariables?.length ?
            <>
                <div>New Variables</div>
                <div className={'grid grid-cols-2'}>
                    <div>name</div>
                    <div>Census Keys</div>
                    {
                        newVariables.map(({name, censusKeys}) => (
                            <>
                                <div>{name}</div>
                                <div>{censusKeys?.join(', ')}</div>
                            </>)
                        )
                    }
                    <div></div>
                    <button key={'btn'}
                            disabled={loading || !newVariables.length}
                            className={`px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-500 rounded-md ${loading ? 'cursor-loading' : 'cursor-pointer'}`}
                            onClick={() => serverCall()}
                    >{loading ? 'loading...' : 'load'}</button>
                </div>
            </> : null
        }
    </div>
)
const DataPage = (props) => {
    const {baseUrl, views, activeViewId, source} = props;
    const navigate = useNavigate();
    const {viewId} = useParams();
    const { pgEnv, user, falcor } = React.useContext(DamaContext)
    const [variables, setVariables] = useState([]); // views has metadata
    const [newVariables, setNewVariables] = useState([]);
    const [newVariable, setNewVariable] = useState({});
    const [loading, setLoading] = useState(false);
    const rtPfx = getDamaApiRoutePrefix(pgEnv);

    const currViewMeta = useMemo(() => views.find(v => +v.view_id === +activeViewId)?.metadata, [views]);
    useEffect(() => {
        if(viewId === activeViewId) return;
        navigate(`${baseUrl}/source/${source.source_id}/data/${activeViewId}`)
    }, [])

    useEffect(() => {
        setVariables(currViewMeta?.variables || []);
    }, [currViewMeta])
    return (
        <div>
            <RenderVersions domain={views} value={activeViewId} onchange={v=>navigate(`${baseUrl}/source/${source.source_id}/data/${v}`)}/>

            <RenderAddNewVariables newVariables={newVariables} setNewVariables={setNewVariables}
                                   newVariable={newVariable} setNewVariable={setNewVariable}
                                   loading={loading}
                                   serverCall={() => CallServer({rtPfx, baseUrl, source, activeViewId, user, navigate, newVariables, setLoading})}
            />

            <div>Existing Variables</div>
            <div className={'grid grid-cols-2'}>
                <div>name</div>
                <div>Census Keys</div>
                {
                    variables.map(({name, censusKeys}) => (
                        <>
                            <div>{name}</div>
                            <div>{censusKeys?.join(', ')}</div>
                        </>)
                    )
                }
            </div>
        </div>
    )
}

const acsConfig = {
    data: {
        name: "Data",
        path: "/data",
        component: DataPage
    },
    sourceCreate: {
        name: "Create",
        component: props => <Create {...props} CallServer={CallServer}/>
    }

};

export default acsConfig;
