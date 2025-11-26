import React, { useState, useContext } from "react";

import {
  checkApiResponse,
  getDamaApiRoutePrefix,
} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
const CallServer = async ({ rtPfx, source, newVersion, navigate, type }) => {
  const url = new URL(`${rtPfx}/hazard_mitigation/tigerFullDownloadAction`);

  url.searchParams.append("source_name", source.name);
  url.searchParams.append("existing_source_id", source.source_id);
  url.searchParams.append("version", newVersion);
  url.searchParams.append("type", type);

  const stgLyrDataRes = await fetch(url);

  await checkApiResponse(stgLyrDataRes);

  const { etl_context_id, source_id } = await stgLyrDataRes.json();

  if (source_id && etl_context_id) {
    navigate(`/source/${source_id}/uploads/${etl_context_id}`);
  }
};

const Create = ({ source, newVersion, baseUrl }) => {
  const navigate = useNavigate();
  const { pgEnv } = useContext(DamaContext);
  const [type, setType] = useState('tiger');

  const rtPfx = getDamaApiRoutePrefix(pgEnv);

  return (
    <div className="w-full">
      <div className="flex justify-between group">
        <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-medium text-gray-500 py-5">Select type:</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div className="pt-3 pr-8">
              <select
                className="w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300"
                value={type}
                onChange={e => {
                  setType(e.target.value);
                }}>
                {(['tiger', 'carto'])
                  .map(v =>
                    <option
                      key={v}
                      value={v}
                      className={`p-2`}>
                      {v}
                    </option>)
                }
              </select>
            </div>
          </dd>
        </div>
      </div>
      <button
        className={`mx-6 p-1 text-sm border-2 border-gray-200 rounded-md`}
        onClick={() =>
          CallServer({
            rtPfx,
            baseUrl,
            source,
            newVersion,
            navigate,
            type
          })
        }
      >
        {source.source_id ? 'Add View' : 'Add Source'}
      </button>
    </div>
  );
};

export default Create;
