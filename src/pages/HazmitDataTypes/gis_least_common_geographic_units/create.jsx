import React, { useState } from "react";

import {
  checkApiResponse,
  getDamaApiRoutePrefix,
} from "../utils/DamaControllerApi";
import { useNavigate } from "react-router-dom";

import { DamaContext } from "~/pages/DataManager/store";

const Create = ({ source, newVersion, baseUrl }) => {
  const [polygon_dama_src_list, setPolygonDamaSrcList] = useState(null);
  const [sending_queue_request, setSendingQueueRequest] = useState(false);
  const [etl_context_info, setEtlContextInfo] = useState(null);
  const [output_dama_source, setOutputDamaSource] = useState(null);

  const navigate = useNavigate();
  const { pgEnv } = React.useContext(DamaContext);
  const rtPfx = getDamaApiRoutePrefix(pgEnv);

  const handleAddNewSourceClick = async () => {
    try {
      const url = new URL(
        `${rtPfx}/gis-least-common-geographic-units-dataset/listPolygonDamaSourcesAndTheirViews`
      );

      const res = await fetch(url);

      await checkApiResponse(res);

      const res_json = await res.json();
      console.log("res", res_json);

      setPolygonDamaSrcList(res_json);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQueueCreateDataSet = async (dama_view_id) => {
    setSendingQueueRequest(true);

    try {
      const url = new URL(
        `${rtPfx}/gis-least-common-geographic-units-dataset/queueCreateDataset`
      );

      url.searchParams.append("dama_view_id", `${dama_view_id}`);

      const res = await fetch(url);

      await checkApiResponse(res);

      const res_json = await res.json();

      console.log(res_json);

      setSendingQueueRequest(false);
      setEtlContextInfo(res_json.etl_context_info);
      setOutputDamaSource(res_json.output_dama_source);
    } catch (err) {
      console.error(err);
    }
  };

  if (polygon_dama_src_list === null) {
    return (
      <div className="w-full">
        <button
          className={`align-right p-2 border-2 border-gray-200`}
          onClick={handleAddNewSourceClick}
        >
          {" "}
          Add New Source
        </button>
      </div>
    );
  }

  if (!etl_context_info) {
    if (sending_queue_request) {
      return <div>Sending request to the server...</div>;
    }
    const table_rows = polygon_dama_src_list.reduce(
      (acc, { source_id, source_name, view_ids }) => {
        for (let i = 0; i < view_ids.length; ++i) {
          const dama_view_id = view_ids[i];
          acc.push(
            <tr>
              <td>{i ? "" : source_id}</td>
              <td>{i ? "" : source_name}</td>
              <td
                onClick={handleQueueCreateDataSet.bind(null, dama_view_id)}
                style={{ color: "#0000EE", cursor: "pointer" }}
              >
                {dama_view_id}
              </td>
            </tr>
          );
        }

        return acc;
      },
      []
    );

    return (
      <div>
        <h4>
          Select a DamaView from which to create the Least Common Geographic
          Units (LCGU) dataset{" "}
        </h4>
        <table>
          <thead>
            <tr>
              <th>Source ID</th>
              <th>Source Name</th>
              <th>View ID</th>
            </tr>
          </thead>
          <tbody>{...table_rows}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <pre style={{ overflow: "visible" }}>
        {JSON.stringify({ etl_context_info, output_dama_source }, null, 4)}
      </pre>
    </div>
  );
};

export default Create;
