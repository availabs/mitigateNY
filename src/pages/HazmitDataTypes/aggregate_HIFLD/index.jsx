import React from 'react';

import { useNavigate } from 'react-router'
import get from 'lodash/get'

import { DamaContext } from "~/pages/DataManager/store";
import { SourceAttributes, ViewAttributes, getAttributes } from "~/pages/DataManager/Source/attributes";

import { DAMA_HOST } from "~/config";

import {
  SOURCE_TO_MAPPING_TYPE_MAPPINGS,
  MAPPING_TYPE_MAPPINGS
} from "./mappings"

const SOURCE_IDS = Object.keys(SOURCE_TO_MAPPING_TYPE_MAPPINGS).sort((a, b) => a - b);

const Create = props => {
  const {
    source = {},
    user = {},
    dataType = "gis_dataset",
    databaseColumnNames = null,
  } = props;

  const navigate = useNavigate()
  const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);
  const { name: damaSourceName, source_id: damaSourceId, type } = source;

  const [createState, setCreateState] = React.useState({
      damaSourceId,
      damaSourceName,
      sourceType: dataType
  });

  React.useEffect(() => {
      setCreateState(prev => ({ ...prev, damaSourceName }));
  }, [damaSourceName]);

  const [readySources, setReadySources] = React.useState({});
  const readySource = React.useCallback(({ source_id, view_id }) => {
    setReadySources(ready => {
      return { ...ready, [source_id]: view_id };
    });
  }, []);
  const unreadySource = React.useCallback(({ source_id }) => {
    setReadySources(ready => {
      delete ready[source_id];
      return { ...ready };
    });
  }, []);

  const allSourcesReady = React.useMemo(() => {
    return Object.keys(readySources).length === SOURCE_IDS.length;
  }, [readySources]);

  const canSubmit = React.useMemo(() => {
    return allSourcesReady && Boolean(damaSourceName);
  }, [allSourcesReady, damaSourceName]);

  const submit = React.useCallback(() => {
    const publishData = {
      source_values: {
        name: createState.damaSourceName,
        type: createState.sourceType || 'gis_dataset',
        categories: [["HIFLD"]]
      },
      source_id: createState.damaSourceId || null,
      user_id: user.id,
      SOURCE_TO_MAPPING_TYPE_MAPPINGS,
      MAPPING_TYPE_MAPPINGS,
      hifld_sources: readySources
    };
    fetch(
      `${ DAMA_HOST }/dama-admin/${ pgEnv }/aggregate_hifld`,
      { method: "POST",
        body: JSON.stringify(publishData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json())
      .then(jsonRes => {
        console.log("RES:", jsonRes);
        navigate(`${baseUrl}/source/${jsonRes.source_id}/uploads/${jsonRes.etl_context_id}`);
      })
  }, [createState, readySources, user, pgEnv]);

  return (
    <div className="group mb-40 pt-2 px-4">
      <div className="flex mb-2">
        <div className={ `
            flex-1 flex items-center justify-center pl-4 font-bold text-2xl
          ` }
        >
          { !allSourcesReady ?
              "You must select a source version." : ""
          }
          { allSourcesReady && !damaSourceName ?
              "All sources Are ready." :
            allSourcesReady && damaSourceName ?
              "Ready to submit" : ""
          }
          { !damaSourceName ?
              <span className="ml-1">You must enter a name.</span> : ""
          }
        </div>
        <button className={ `
            rounded-md px-4 py-2 border-2 border-blue-300 bg-blue-500
            shadow hover:shadow-lg text-slate-100 hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          ` }
          disabled={ !canSubmit }
          onClick={ submit }
        >
            Submit
        </button>
      </div>
      { SOURCE_IDS.map(sid => (
          <HIFLD_Source key={ sid }
            source_id={ sid }
            readySource={ readySource }
            unreadySource={ unreadySource }/>
        ))
      }
      <div className="flex">
        <div className={ `
            flex-1 flex items-center justify-center pl-4 font-bold text-2xl
          ` }
        >
          { !allSourcesReady ?
              "You must select a source version." : ""
          }
          { allSourcesReady && !damaSourceName ?
              "All sources Are ready." :
            allSourcesReady && damaSourceName ?
              "Ready to submit." : ""
          }
          { !damaSourceName ?
              <span className="ml-1">You must enter a name.</span> : ""
          }
        </div>
        <button className={ `
            rounded-md px-4 py-2 border-2 border-blue-300 bg-blue-500
            shadow hover:shadow-lg text-slate-100 hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
          ` }
          disabled={ !canSubmit }
          onClick={ submit }
        >
            Submit
        </button>
      </div>
    </div>
  )
}

const HIFLD_Source = ({ source_id, readySource, unreadySource }) => {

  const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);

  React.useEffect(() => {
    // dama[{keys:pgEnvs}].sources.byId[{keys:sourceIds}].attributes[${sourceAttrs}]
    falcor.get([
      "dama", pgEnv, "sources", "byId", source_id,
      "attributes", Object.values(SourceAttributes)
    ])
  }, [source_id, falcor, pgEnv]);

  const [sourceData, setSourceData] = React.useState({});

  React.useEffect(() => {
    const src = get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "attributes"], {});
    setSourceData(src);
  }, [falcorCache, pgEnv, source_id]);

  React.useEffect(() => {
    falcor.get(["dama", pgEnv, "sources", "byId", source_id, "views", "length"]);
    const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "length"], 0);
    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byId", source_id, "views", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(ViewAttributes)
      ]);
    }
  }, [source_id, falcor, falcorCache, pgEnv]);

  const [selectedViewId, setSelectedViewId] = React.useState("none");
  const doOnChange = React.useCallback(e => {
    setSelectedViewId(e.target.value)
  }, []);

  React.useEffect(() => {
    if (selectedViewId === "none") {
      unreadySource({ source_id });
    }
    else {
      readySource({ source_id, view_id: selectedViewId });
    }
  }, [source_id, selectedViewId, readySource, unreadySource]);

  const views = React.useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
      .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
  }, [falcorCache, source_id, pgEnv]);

  React.useEffect(() => {
    if ((views.length === 1) && (selectedViewId === "none")) {
      setSelectedViewId(views[0].view_id);
    }
  }, [selectedViewId, views]);

  const { fcodeType, column, mappings } = React.useMemo(() => {
    const fcodeType = SOURCE_TO_MAPPING_TYPE_MAPPINGS[source_id];
    const mappingType = MAPPING_TYPE_MAPPINGS[fcodeType];
    const column = mappingType?.column || "unknown";
    const mappings = mappingType?.mappings || {};
    return { fcodeType, column, mappings };
  }, [source_id]);

  const [hovering, setHovering] = React.useState(false);
  const doMouseEnter = React.useCallback(e => {
    if (fcodeType === "source") return;
    setHovering(true);
  }, [fcodeType]);
  const doMouseLeave = React.useCallback(e => {
    setHovering(false);
  }, []);

  return (
    <div className="border-t-2 py-1 px-4 grid grid-cols-12 gap-4">

      <div className={  `
          col-span-7 relative border-r-2
          ${ fcodeType === "source" ? "" : "cursor-pointer" }
        ` }
        onMouseEnter={ doMouseEnter }
        onMouseLeave={ doMouseLeave }
      >
        <div className="pr-8">({ source_id }) { sourceData.name || "LOADING..." }</div>
        <HIFLD_FCodeSource
          source_id={ source_id }
          hovering={ hovering }/>

        <div className={ `
            absolute w-full top-100 px-4 py-2 bg-white z-10
            ${ hovering ? "block" : "hidden" }
          ` }
        >
          <div className="w-full grid grid-cols-6 gap-4 font-bold">
            <div className="col-span-2 col-start-1 text-right border-b-2 px-2">
              { column }
            </div>
            <div className="col-span-4 border-b-2 px-2">
              FCode
            </div>
          </div>
          { Object.entries(mappings).map(([key, value]) => (
              <div key={ key } className="w-full grid grid-cols-6 gap-4">
                <div className="col-span-2 col-start-1 text-right px-2">{  key }</div>
                <div className="col-span-2 px-2">{ value }</div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="col-span-5">
        <div className="flex">
          <div className="mr-2">Version: </div>
          <select className="flex-1"
            value={ selectedViewId }
            onChange={ doOnChange }
          >
            <option value="none">Select a version...</option>
            { views.map(v => (
                <option key={ v.view_id } value={ v.view_id }>
                  { v.version || v.view_id }
                </option>
              ))
            }
          </select>
        </div>
        <div className="text-sm leading-6 flex justify-center">
          { views.length === 1 ?
              "Single view detected, no action required." :
            views.length > 1 ?
              "Multiple views detected, make a selection." :
              "No views detected."
          }
        </div>
      </div>

    </div>
  )
}
const HIFLD_FCodeSource = ({ source_id, hovering }) => {

  const { fcodeType, column, mappings } = React.useMemo(() => {
    const fcodeType = SOURCE_TO_MAPPING_TYPE_MAPPINGS[source_id];
    const mappingType = MAPPING_TYPE_MAPPINGS[fcodeType];
    const column = mappingType?.column || "unknown";
    const mappings = mappingType?.mappings || {};
    return { fcodeType, column, mappings };
  }, [source_id]);

  return fcodeType === "source" ? (
      <div>
        Will receive FCode: { mappings[source_id] }
      </div>
    ) : (
      <div>
        <div>Will receive FCode from column "{ column }" (hover to see mappings)</div>
      </div>
    )
}

const AggregateHIFLD = {
  stats: {
    name: 'Stats',
    path: '/stats',
    component: () => <div> No stats </div>
  },
  sourceCreate: {
    name: 'Create',
    component: Create
  }
}

export default AggregateHIFLD
