import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  checkApiResponse,
  getDamaApiRoutePrefix,
} from "../utils/DamaControllerApi";

import { DamaContext } from "~/pages/DataManager/store";

const NOTHING_SELECTED = -1;

const Initializing = ({ rtPfx, setPolygonDamaSrcList, setErrorMessage }) => {
  useEffect(() => {
    (async () => {
      const url = new URL(
        `${rtPfx}/gis-least-common-geographic-units-dataset/listPolygonDamaSourcesAndTheirViews`
      );

      const res = await fetch(url);

      try {
        await checkApiResponse(res);
      } catch (err) {
        setErrorMessage(err.message);
      }

      const res_json = await res.json();

      setPolygonDamaSrcList(res_json);
    })();
  }, [rtPfx]);

  return <div>Initializing...</div>;
};

const ErrorMessage = ({ error_message }) => (
  <table
    className="w-2/3 mx-auto text-center"
    style={{
      margin: "40px auto",
      textAlign: "center",
      border: "1px solid",
      borderColor: "back",
    }}
  >
    <thead
      style={{
        color: "black",
        backgroundColor: "red",
        fontWeight: "bolder",
        textAlign: "center",
        marginTop: "40px",
        fontSize: "20px",
        border: "1px solid",
        borderColor: "black",
      }}
    >
      <tr>
        <th style={{ border: "1px solid", borderColor: "black" }}> Error</th>
      </tr>
    </thead>
    <tbody style={{ border: "1px solid" }}>
      <tr style={{ border: "1px solid" }}>
        <td
          style={{
            border: "1px solid",
            padding: "10px",
            backgroundColor: "white",
            color: "darkred",
          }}
        >
          {error_message}
        </td>
      </tr>
    </tbody>
  </table>
);

const InputDamaViewSelector = ({
  polygon_dama_src_list,
  selected_view_id,
  selectViewID,
}) => {
  const [selected_source_id, selectSourceID] = useState(NOTHING_SELECTED);

  const source_options = [
    <option className="p-2" disabled={true} value={NOTHING_SELECTED}>
      Select input polygon data source
    </option>,
    ...polygon_dama_src_list
      .filter(({ view_ids }) => view_ids.length)
      .map(({ source_id, source_name }) => (
        <option className="p-2" value={source_id}>
          {source_name}
        </option>
      )),
  ];

  const source_selector = (
    <div className="flex justify-between group">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 py-5">
          Polygon GIS Data Source
        </dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <select
              value={selected_source_id}
              className="w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300"
              onChange={(e) => {
                console.log("==>", e);
                selectViewID(NOTHING_SELECTED);
                selectSourceID(+e.target.value);
              }}
            >
              {...source_options}
            </select>
          </div>
        </dd>
      </div>
    </div>
  );

  const { view_ids: source_view_ids = null } =
    selected_source_id !== NOTHING_SELECTED
      ? polygon_dama_src_list.find(
          ({ source_id }) => source_id === selected_source_id
        )
      : {};

  const source_view_options = source_view_ids && [
    <option className="p-2" disabled={true} value={NOTHING_SELECTED}>
      Select view id
    </option>,
    ...source_view_ids.map((view_id) => (
      <option className="p-2" value={view_id}>
        {view_id}
      </option>
    )),
  ];

  const view_selector = source_view_options && (
    <div className="flex justify-between group">
      <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500 py-5">View ID</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
          <div className="pt-3 pr-8">
            <select
              value={selected_view_id}
              className="w-full bg-white p-3 flex-1 shadow bg-grey-50 focus:bg-blue-100  border-gray-300"
              onChange={(e) => {
                console.log("==>", e);
                selectViewID(+e.target.value);
              }}
            >
              {...source_view_options}
            </select>
          </div>
        </dd>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 font-medium">Select Input GIS Dataset</div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {source_selector}
          {view_selector || ""}
        </dl>
      </div>
    </div>
  );
};

const ProcessButton = ({
  rtPfx,
  selected_view_id,
  setSendingQueueRequest,
  setEtlContextInfo,
  setErrorMessage,
}) => {
  console.log("==>", selected_view_id);
  if (selected_view_id === NOTHING_SELECTED) {
    return "";
  }

  const handleQueueCreateDataSet = async () => {
    setSendingQueueRequest(true);

    const url = new URL(
      `${rtPfx}/gis-least-common-geographic-units-dataset/queueCreateDataset`
    );

    url.searchParams.append("dama_view_id", `${selected_view_id}`);

    const res = await fetch(url);

    try {
      await checkApiResponse(res);
    } catch (err) {
      setErrorMessage(err.message);
    }

    const res_json = await res.json();

    console.log(res_json);

    setSendingQueueRequest(false);
    setEtlContextInfo(res_json.etl_context_info);
  };

  return (
    <button
      className="align-right p-2 border-2 border-gray-200"
      onClick={handleQueueCreateDataSet}
    >
      Process
    </button>
  );
};

const Create = ({ source, newVersion, baseUrl }) => {
  console.log("baseUrl:", baseUrl);

  const navigate = useNavigate();

  const { pgEnv, user, falcor } = React.useContext(DamaContext);
  const rtPfx = getDamaApiRoutePrefix(pgEnv);

  const [polygon_dama_src_list, setPolygonDamaSrcList] = useState(null);

  const [selected_view_id, selectViewID] = useState(NOTHING_SELECTED);

  const [sending_queue_request, setSendingQueueRequest] = useState(false);
  const [etl_context_info, setEtlContextInfo] = useState(null);

  const [error_message, setErrorMessage] = useState(null);

  console.log({ polygon_dama_src_list });

  // Error state.
  if (error_message) {
    return <ErrorMessage error_message={error_message} />;
  }

  // The process request has been sent and the response has been received. Navigate to uploads page.
  if (etl_context_info) {
    const { source_id, etl_context_id } = etl_context_info;

    // https://devmny.org/cenrep/source/439/uploads/3669
    navigate(`/cenrep/source/${source_id}/uploads/${etl_context_id}`);
  }

  // Process request has been sent, but etl_context_info response has not yet been received.
  if (sending_queue_request) {
    return <div>Sending process request. Please wait...</div>;
  }

  // Do not yet have the list of Polygon Dama Sources and Views.
  if (polygon_dama_src_list === null) {
    return (
      <Initializing
        rtPfx={rtPfx}
        setPolygonDamaSrcList={setPolygonDamaSrcList}
        setErrorMessage={setErrorMessage}
      />
    );
  }

  // Require user input.
  return (
    <div>
      <InputDamaViewSelector
        polygon_dama_src_list={polygon_dama_src_list}
        selected_view_id={selected_view_id}
        selectViewID={selectViewID}
      />
      <ProcessButton
        {...{
          rtPfx,
          selected_view_id,
          setSendingQueueRequest,
          setEtlContextInfo,
          setErrorMessage,
        }}
      />
    </div>
  );
};

export default Create;
