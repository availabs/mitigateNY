import React, { useState, useContext } from "react";

import {
  checkApiResponse,
  getDamaApiRoutePrefix,
} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router";

import { DamaContext } from "~/pages/DataManager/store";
const CallServer = async ({ rtPfx, source, newVersion, navigate }) => {
  const url = new URL(`${rtPfx}/hazard_mitigation/tigerFullDownloadAction`);

  url.searchParams.append("source_name", source.name);
  url.searchParams.append("existing_source_id", source.source_id);
  url.searchParams.append("version", newVersion);

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

  const rtPfx = getDamaApiRoutePrefix(pgEnv);

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
