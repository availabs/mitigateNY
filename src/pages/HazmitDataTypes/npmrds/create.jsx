import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { DAMA_HOST } from '~/config'

import { DamaContext } from "~/pages/DataManager/store";
const CallServer = async ({ rtPfx, source, newVersion, navigate, baseUrl='cenrep' }) => {
    const url = new URL(`${rtPfx}/npmrds`);

    url.searchParams.append("source_name", source.name);
    url.searchParams.append("existing_source_id", source.source_id);
    url.searchParams.append("version", newVersion);

    const stgLyrDataRes = await fetch(url);

    // await checkApiResponse(stgLyrDataRes);

    const { etl_context_id, source_id } = await stgLyrDataRes.json();

    if (source_id && etl_context_id) {
        navigate(`/${baseUrl}/source/${source_id}/uploads/${etl_context_id}`);
    }
};

const Create = ({ source, newVersion, baseUrl }) => {
    const navigate = useNavigate();
    const { pgEnv } = useContext(DamaContext);

    const rtPfx = `${DAMA_HOST}/dama-admin/${pgEnv}` //getDamaApiRoutePrefix(pgEnv);

    return (
        <div className="w-full">
            <button
                className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
                onClick={() =>
                    CallServer({
                        rtPfx,
                        baseUrl,
                        source,
                        newVersion,
                        navigate,
                    })
                }
            >
                {source.source_id ? 'Add View' : 'Add Source'}
            </button>
        </div>
    );
};

export default Create;