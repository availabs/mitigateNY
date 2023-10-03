import React, { useState, useContext } from "react";

import {
  checkApiResponse,
  getDamaApiRoutePrefix,
} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";
const CallServer = async ({
  rtPfx,
  baseUrl,
  source,
  tigerTable,
  newVersion,
  navigate,
  setVar,
  setSourceValues,
}) => {
  const url = new URL(`${rtPfx}/hazard_mitigation/tigerDownloadAction`);

  url.searchParams.append("table_name", tigerTable);
  url.searchParams.append("source_name", source.name);
  url.searchParams.append("existing_source_id", source.source_id);
  url.searchParams.append("version", newVersion);

  const stgLyrDataRes = await fetch(url);

  await checkApiResponse(stgLyrDataRes);

  const { etl_context_id, source_id, isNewSource } = await stgLyrDataRes.json();

  if (!isNewSource) {
    setVar(false);
    setSourceValues({ etl_context_id, source_id });
  } else {
    if (source_id && etl_context_id) {
      navigate(`/source/${source_id}/uploads/${etl_context_id}`);
    } else {
      navigate(`/source/${source_id}/versions`);
    }
  }
};

const RenderTigerTables = ({ value, setValue, domain }) => {
  return (
    <div className="flex justify-between group">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 py-5">
          Select Type:{" "}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <select
              className="w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300"
              value={value || ""}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            >
              <option value="" disabled>
                Select your option
              </option>
              {domain?.map((v) => (
                <option key={v} value={v} className="p-2">
                  {v}
                </option>
              ))}
            </select>
          </div>
        </dd>
      </div>
    </div>
  );
};

const Create = ({ source, newVersion, baseUrl }) => {
  const navigate = useNavigate();
  const { pgEnv } = useContext(DamaContext);
  const [tigerTable, setTigerTable] = useState();
  const [isNewSource, setVar] = useState(true);
  const [sourceValues, setSourceValues] = useState({
    etl_context_id: null,
    source_id: null,
  });

  const rtPfx = getDamaApiRoutePrefix(pgEnv);

  return (
    <div className="w-full">
      {RenderTigerTables({
        value: tigerTable,
        setValue: setTigerTable,
        domain: ["STATE", "COUNTY", "COUSUB", "TRACT"],
      })}
      <button
        className={`align-right p-2 border-2 border-gray-200`}
        onClick={() =>
          CallServer({
            rtPfx,
            baseUrl,
            source,
            tigerTable,
            newVersion,
            navigate,
            setVar,
            setSourceValues,
          })
        }
        disabled={!tigerTable}
      >
        Add New Source
      </button>

      {!isNewSource ? (
        <>
          <br />
          <span> Source with type {tigerTable} already created </span>&nbsp;
          <button
            className={`align-right p-2 border-2 border-gray-200`}
            onClick={() => {
              if (sourceValues?.source_id && sourceValues?.etl_context_id) {
                navigate(
                  `/source/${sourceValues?.source_id}/uploads/${sourceValues?.etl_context_id}`
                );
              } else {
                navigate(`/source/${sourceValues?.source_id}`);
              }
            }}
          >
            Check Progress...
          </button>
        </>
      ) : null}
    </div>
  );
};

export default Create;
