import React from 'react';

import { useNavigate } from 'react-router-dom'
import get from 'lodash/get'

import { DamaContext } from "~/pages/DataManager/store";
import { SourceAttributes, ViewAttributes, getAttributes } from "~/pages/DataManager/Source/attributes";

import { DAMA_HOST } from "~/config";

const NRI_COLUMNS = [
  "tractfips",
  "avln_risks",
  "cfld_risks",
  "cwav_risks",
  "drgt_risks",
  "erqk_risks",
  "hail_risks",
  "hwav_risks",
  "hrcn_risks",
  "istm_risks",
  "lnds_risks",
  "ltng_risks",
  "rfld_risks",
  "swnd_risks",
  "trnd_risks",
  "tsun_risks",
  "vlcn_risks",
  "wfir_risks",
  "wntw_risks"
]

const useGetSources = ({ falcorCache, pgEnv, categories = [], columns = [] }) => {
  return React.useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
      .filter(src => {
        return categories.reduce((a, c) => {
          return a && src?.categories?.reduce((aa, cc) => {
            return cc.reduce((aaa, ccc) => aaa || (ccc === c), aa);
          }, false);
        }, true);
      })
      .filter(d => {
        const mdColumns = get(d, ["metadata", "columns"], get(d, "metadata", []));
        if (Array.isArray(mdColumns)) {
          const mdColumnsMap = mdColumns.reduce((a, c) => {
            a.add(c.name);
            return a;
          }, new Set());
          return columns.reduce((a, c) => {
            return a && mdColumnsMap.has(c);
          }, true);
        }
        return false;
      }).sort((a, b) => a.name.localeCompare(b.name));
  }, [falcorCache, pgEnv, categories, columns]);
}

const useFetchSourceViews = ({ falcor, falcorCache, pgEnv, source_id }) => {
  React.useEffect(() => {
    if (!source_id) return;

    falcor.get(["dama", pgEnv, "sources", "byId", source_id, "views", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byId", source_id, "views", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(ViewAttributes)
      ]);
    }
  }, [falcor, falcorCache, pgEnv, source_id]);
}

const useGetViews = ({ falcorCache, pgEnv, source_id }) => {
  return React.useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
      .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
  }, [falcorCache, source_id, pgEnv]);
}

function Create ({
  source = {},
  user = {},
  dataType = "gis_dataset",
  databaseColumnNames = null,
}) {

  const navigate = useNavigate()
  const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);
  const { name: damaSourceName, source_id: damaSourceId, type } = source;

  const [createState, setCreateState] = React.useState({
      damaSourceId,
      damaSourceName,

      sourceType: dataType,

      parcelSourceId:null,
      parcelViewId: null,

      footprintSourceId: null,
      footprintViewId: null,

      ogsSourceId: null,
      ogsViewId: null,

      blockSourceId: null,
      blockViewId: null,

      orptsSourceId: null,
      orptsViewId: null,

      orptsIndustrialSourceId: null,
      orptsIndustrialViewId: null,

      orptsResidentialSourceId: null,
      orptsResidentialViewId: null,

      orptsCommercialSourceId: null,
      orptsCommercialViewId: null,

      hifldSourceId: null,
      hifldViewId: null,

      historicSourceId: null,
      historicViewId: null,

      nriSourceId: null,
      nriViewId: null,

      floodZoneSourceId: null,
      floodZoneViewId: null
  });

  const hasAllData = React.useMemo(() => {
    const {
      parcelViewId = null,
      footprintViewId = null,
      ogsViewId = null,
      blockViewId = null,
      hifldViewId = null,
      historicViewId = null,
      nriViewId = null,
      floodZoneViewId = null,

      orptsIndustrialViewId = null,
      orptsResidentialViewId = null,
      orptsCommercialViewId = null,

    } = createState;
    return Boolean(parcelViewId &&
                    footprintViewId &&
                    nriViewId &&
                    ogsViewId &&
                    blockViewId &&
                    orptsIndustrialViewId &&
                    orptsResidentialViewId &&
                    orptsCommercialViewId &&
                    hifldViewId &&
                    historicViewId &&
                    floodZoneViewId
                  );
  }, [createState]);

  const missingName = React.useMemo(() => {
    return Boolean(!damaSourceName) && hasAllData;
  }, [hasAllData, damaSourceName]);

  const canSubmit = React.useMemo(() => {
    return Boolean(damaSourceName) && hasAllData;
  }, [hasAllData, damaSourceName]);

  const submit = React.useCallback(() => {
    const publishData = {
      source_id: createState.damaSourceId || null,
      source_values: {
        name: createState.damaSourceName,
        type: createState.sourceType || 'gis_dataset',
        categories: [["Enhanced Footprints"], ["BILD"], ["Cenrep"]]
      },
      user_id: user.id,
      footprint_view_id: createState.footprintViewId,
      parcel_view_id: createState.parcelViewId,
      nri_view_id: createState.nriViewId,
      ogs_view_id: createState.ogsViewId,
      block_view_id: createState.blockViewId,
      orpts_industrial_view_id: createState.orptsIndustrialViewId,
      orpts_residential_view_id: createState.orptsResidentialViewId,
      orpts_commercial_view_id: createState.orptsCommercialViewId,
      hifld_view_id: createState.hifldViewId,
      historic_view_id: createState.historicViewId,
      flood_zone_view_id: createState.floodZoneViewId
    };
    fetch(
      `${ DAMA_HOST }/dama-admin/${ pgEnv }/parcels2footprints`,
      { method: "POST",
        body: JSON.stringify(publishData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json())
      .then(jsonRes => {
        console.log("RES:", jsonRes);
        // navigate(`${baseUrl}/source/${jsonRes.source_id}/uploads/${jsonRes.etl_context_id}`);
      })
  }, [createState, user, pgEnv]);

// update source name
  React.useEffect(() => {
      setCreateState({ ...createState, damaSourceName });
  }, [damaSourceName]);

  React.useEffect(() => {
    falcor.get(["dama", pgEnv, "sources", "length"]);

    const length = get(falcorCache, ["dama", pgEnv, "sources", "length"], 0);

    if (length) {
      falcor.get([
        "dama", pgEnv, "sources", "byIndex",
        { from: 0, to: length - 1 },
        "attributes", Object.values(SourceAttributes)
      ])
    }
  }, [falcor, falcorCache, pgEnv]);

  const parcelSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["Parcels"],
                                        columns: ["ogc_fid", "wkb_geometry"]
                                      });
// console.log("parcelSources", parcelSources);

  const footprintSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["Buildings"],
                                        columns: ["ogc_fid", "wkb_geometry"]
                                      });
// console.log("footprintSources", footprintSources);

  const ogsSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["OGS"],
                                        columns: ["ogc_fid", "wkb_geometry"]
                                      });
// console.log("ogsSources", ogsSources);

  const blockSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["Geography"],
                                        columns: ["ogc_fid", "wkb_geometry"]
                                      });
// console.log("blockSources", blockSources);

  const orptsSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["ORPTS"],
                                        columns: ["ogc_fid"]
                                      });
// console.log("orptsSources", orptsSources);

  const hifldSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["HIFLD"],
                                        columns: ["ogc_fid"]
                                      });
// console.log("hifldSources", hifldSources);

  const historicSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["Historic"],
                                        columns: ["ogc_fid", "wkb_geometry"]
                                      });
// console.log("hifldSources", hifldSources);

  const nriSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["NRI"],
                                        columns: NRI_COLUMNS
                                      });
// console.log("hifldSources", hifldSources);

  const floodZoneSources = useGetSources({ falcorCache,
                                        pgEnv,
                                        categories: ["Flood Maps"],
                                        columns: ["wkb_geometry", "fld_zone", "zone_subty"]
                                      });
// console.log("hifldSources", hifldSources);

  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.parcelSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.footprintSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.ogsSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.blockSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsIndustrialSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsResidentialSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsCommercialSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.hifldSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.historicSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.nriSourceId });
  useFetchSourceViews({ falcor, falcorCache, pgEnv, source_id: createState.floodZoneSourceId });

  const parcelViews = useGetViews({ falcorCache, pgEnv, source_id: createState.parcelSourceId });
  const footprintViews = useGetViews({ falcorCache, pgEnv, source_id: createState.footprintSourceId });
  const ogsViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.ogsSourceId });
  const blockViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.blockSourceId });
  const orptsIndustrialViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsIndustrialSourceId });
  const orptsResidentialViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsResidentialSourceId });
  const orptsCommercialViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.orptsCommercialSourceId });
  const hifldViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.hifldSourceId });
  const historicViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.historicSourceId });
  const nriViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.nriSourceId });
  const floodZoneViews = useGetViews({ falcor, falcorCache, pgEnv, source_id: createState.floodZoneSourceId });

  return (
    <div className="group mb-40">

      <SourceAndViewSelectors
        label="Parcel"

        sources={ parcelSources }
        sourceKey="parcelSourceId"
        sourceValue={ createState.parcelSourceId }

        views={ parcelViews }
        viewKey="parcelViewId"
        viewValue={ createState.parcelViewId }

        setCreateState={ setCreateState }/>

      { createState.parcelViewId && (
          <SourceAndViewSelectors
            label="Foorprint"

            sources={ footprintSources }
            sourceKey="footprintSourceId"
            sourceValue={ createState.footprintSourceId }

            views={ footprintViews }
            viewKey="footprintViewId"
            viewValue={ createState.footprintViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.footprintViewId && (
          <SourceAndViewSelectors
            label="OGS"

            sources={ ogsSources }
            sourceKey="ogsSourceId"
            sourceValue={ createState.ogsSourceId }

            views={ ogsViews }
            viewKey="ogsViewId"
            viewValue={ createState.ogsViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.ogsViewId && (
          <SourceAndViewSelectors
            label="Block Group"

            sources={ blockSources }
            sourceKey="blockSourceId"
            sourceValue={ createState.blockSourceId }

            views={ blockViews }
            viewKey="blockViewId"
            viewValue={ createState.blockViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.blockViewId && (
          <SourceAndViewSelectors
            label="ORPTS Industrial"

            sources={ orptsSources }
            sourceKey="orptsIndustrialSourceId"
            sourceValue={ createState.orptsIndustrialSourceId }

            views={ orptsIndustrialViews }
            viewKey="orptsIndustrialViewId"
            viewValue={ createState.orptsIndustrialViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.orptsIndustrialViewId && (
          <SourceAndViewSelectors
            label="ORPTS Residential"

            sources={ orptsSources }
            sourceKey="orptsResidentialSourceId"
            sourceValue={ createState.orptsResidentialSourceId }

            views={ orptsResidentialViews }
            viewKey="orptsResidentialViewId"
            viewValue={ createState.orptsResidentialViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.orptsResidentialViewId && (
          <SourceAndViewSelectors
            label="ORPTS Commercial"

            sources={ orptsSources }
            sourceKey="orptsCommercialSourceId"
            sourceValue={ createState.orptsCommercialSourceId }

            views={ orptsCommercialViews }
            viewKey="orptsCommercialViewId"
            viewValue={ createState.orptsCommercialViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.orptsCommercialViewId && (
          <SourceAndViewSelectors
            label="HIFLD"

            sources={ hifldSources }
            sourceKey="hifldSourceId"
            sourceValue={ createState.hifldSourceId }

            views={ hifldViews }
            viewKey="hifldViewId"
            viewValue={ createState.hifldViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.hifldViewId && (
          <SourceAndViewSelectors
            label="Historic"

            sources={ historicSources }
            sourceKey="historicSourceId"
            sourceValue={ createState.historicSourceId }

            views={ historicViews }
            viewKey="historicViewId"
            viewValue={ createState.historicViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.historicViewId && (
          <SourceAndViewSelectors
            label="NRI"

            sources={ nriSources }
            sourceKey="nriSourceId"
            sourceValue={ createState.nriSourceId }

            views={ nriViews }
            viewKey="nriViewId"
            viewValue={ createState.nriViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { createState.nriViewId && (
          <SourceAndViewSelectors
            label="Flood Zone"

            sources={ floodZoneSources }
            sourceKey="floodZoneSourceId"
            sourceValue={ createState.floodZoneSourceId }

            views={ floodZoneViews }
            viewKey="floodZoneViewId"
            viewValue={ createState.floodZoneViewId }

            setCreateState={ setCreateState }/>
        )
      }

      { missingName && (
          <div className="text-center pt-2 font-bold text-lg border-t mt-3">
            You must enter a name! (Scroll to the top of page)
          </div>
        )
      }

      { canSubmit && (
          <div className='w-full flex p-4'>
            <div className='flex-1' />
            <div>
              <button onClick={ submit }
                className="rounded-md p-2 border-2 border-blue-300 bg-blue-500 shadow hover:shadow-lg text-slate-100 hover:bg-blue-700"
                disabled={ !canSubmit }
              >
                Process
              </button>
            </div>
          </div>
        )
      }
    </div>
  )
}

const SourceAndViewSelectors = props => {
  const {
    label,
    sourceKey,
    sourceValue,
    viewKey,
    viewValue,
    setCreateState,
    sources = [],
    views = [],
    children
  } = props
  return (
    <>
      <SourceSelector
        label={ `Select ${ label } Source` }
        sourceKey={ sourceKey }
        viewKey={ viewKey }
        value={ sourceValue }
        setCreateState={ setCreateState }
        sources={ sources }/>

        { children }

        { sourceValue && (
            <ViewSelector
              label={ `Select ${ label } Version` }
              viewKey={ viewKey }
              value={ viewValue }
              setCreateState={ setCreateState }
              views={ views }/>
          )
        }
    </>
  )
}

const SourceSelector = ({ label, sourceKey, viewKey, value, setCreateState, sources = [] }) => {

  const onChange = React.useCallback(e => {
    if (e.target.value === "no-value") {
      setCreateState(prev => ({ ...prev, [sourceKey]: null, [viewKey]: null }));
    }
    else {
      setCreateState(prev => ({ ...prev, [sourceKey]: e.target.value, [viewKey]: null }));
    }
  }, [setCreateState, sourceKey, viewKey]);

  React.useEffect(() => {
    if ((value === null) && (sources.length === 1)) {
      setCreateState(prev => ({ ...prev, [sourceKey]: sources[0].source_id, [viewKey]: null }));
    }
  }, [value, setCreateState, sourceKey, viewKey, sources.length]);

  return (
    <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-3">
      <dt className="text-sm font-medium text-gray-500 pt-5 pb-3">
        { label }
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div className="pt-3 pr-8">
          <select
              value={ value || "no-value" }
              onChange={ onChange }
              className='px-2 py-4 w-full bg-white shadow'
          >
            <option value="no-value">{ label }</option>
            { sources.map(s =>
                <option key={ s.source_id }
                  value={ s.source_id }
                >
                  { s.name }
                </option>
              )
            }
          </select>
        </div>
      </dd>
    </div>
  )
}
const ViewSelector = ({ label, viewKey, value, setCreateState, views = [] }) => {

  const onChange = React.useCallback(e => {
    if (e.target.value === "no-value") {
      setCreateState(prev => ({ ...prev, [viewKey]: null }));
    }
    else {
      setCreateState(prev => ({ ...prev, [viewKey]: e.target.value }));
    }
  }, [setCreateState, viewKey]);

  React.useEffect(() => {
    if ((value === null) && (views.length === 1)) {
      setCreateState(prev => ({ ...prev, [viewKey]: views[0].view_id }));
    }
  }, [value, setCreateState, viewKey, views.length]);

  return (
    <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-3">
      <dt className="text-sm font-medium text-gray-500 pt-5 pb-3">
        { label }
      </dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div className="pt-3 pr-8">
          <select
              value={ value || "no-value" }
              onChange={ onChange }
              className='px-2 py-4 w-full bg-white shadow'
          >
            <option value="no-value">{ label }</option>
            { views.map(v =>
                <option key={ v.view_id }
                  value={ v.view_id }
                >
                  { v.version || `View ID: ${ v.view_id }` }
                </option>
              )
            }
          </select>
        </div>
      </dd>
    </div>
  )
}


const Parcels2Footprints = {

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

export default Parcels2Footprints
