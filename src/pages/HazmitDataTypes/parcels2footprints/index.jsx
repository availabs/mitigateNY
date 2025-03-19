import React from 'react';

import { useNavigate } from 'react-router-dom'
import get from 'lodash/get'

import { DamaContext } from "~/pages/DataManager/store";
import { SourceAttributes, ViewAttributes, getAttributes } from "~/pages/DataManager/Source/attributes";

import { DAMA_HOST } from "~/config";

function Create ({
  source = {},
  user = {},
  dataType = "gis_dataset",
  databaseColumnNames = null,
}) {

  // console.log('tippecanoeOptions', tippecanoeOptions)
    const navigate = useNavigate()
    const { pgEnv, baseUrl, falcor, falcorCache } = React.useContext(DamaContext);
    const { name: damaSourceName, source_id: damaSourceId, type } = source;

// console.log("PG ENV:", pgEnv)

    const [createState, setCreateState] = React.useState({
        damaSourceId,
        damaSourceName,

        sourceType: dataType,

        parcelSourceId:null,
        parcelViewId: null,

        footprintSourceId: null,
        footprintViewId: null,

        elevationSourceId: null,
        elevationViewId: null,

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
        hifldViewId: null
    })

    const canSubmit = React.useMemo(() => {
      const {
        parcelViewId = null,
        footprintViewId = null,
        elevationViewId = null,
        ogsViewId = null,
        blockViewId = null,

        orptsIndustrialViewId = null,
        orptsResidentialViewId = null,
        orptsCommercialViewId = null,

        hifldViewId = null
      } = createState;
      return Boolean(damaSourceName &&
                      parcelViewId &&
                      footprintViewId &&
                      elevationViewId &&
                      ogsViewId &&
                      blockViewId &&
                      orptsIndustrialViewId &&
                      orptsResidentialViewId &&
                      orptsCommercialViewId &&
                      hifldViewId
                    );
    }, [damaSourceName, createState]);

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
        elevation_view_id: createState.elevationViewId,
        ogs_view_id: createState.ogsViewId,
        block_view_id: createState.blockViewId,
        orpts_industrial_view_id: createState.orptsIndustrialViewId,
        orpts_residential_view_id: createState.orptsResidentialViewId,
        orpts_commercial_view_id: createState.orptsCommercialViewId,
        hifld_view_id: createState.hifldViewId
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

    const parcelSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('Parcels'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("parcelSources", parcelSources);

    const footprintSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('Buildings'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("footprintSources", footprintSources);

    const elevationSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('Elevations'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("elevationSources", elevationSources);

    const ogsSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('OGS'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("ogsSources", ogsSources);

    const blockSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('Geography'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("blockSources", blockSources);

    const orptsSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('ORPTS'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            return columns.reduce((a, c) => {
              return a || c.name.includes("ogc_fid");
            }, false);
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("orptsSources", orptsSources);

    const hifldSources = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .filter(d => d?.categories?.map(d => d[0])?.includes('HIFLD'))
        .filter(d => {
          const columns = get(d, ["metadata", "columns"], get(d, "metadata", []));
          if (Array.isArray(columns)) {
            const [hasGeom, hasOgcFid] = columns.reduce((a, c) => {
              return [
                a[0] || c.name.includes("wkb_geometry"),
                a[1] || c.name.includes("ogc_fid")
              ]
            }, [false, false]);
            return hasGeom && hasOgcFid;
          }
          return false;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [falcorCache, pgEnv]);

// console.log("hifldSources", hifldSources);

    React.useEffect(() => {
      const prclSrcId = createState.parcelSourceId;

      if (!prclSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", prclSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", prclSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", prclSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.parcelSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const fpSrcId = createState.footprintSourceId;

      if (!fpSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", fpSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", fpSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", fpSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.footprintSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const eSrcId = createState.elevationSourceId;

      if (!eSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", eSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", eSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", eSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.elevationSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const ogsSrcId = createState.ogsSourceId;

      if (!ogsSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", ogsSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", ogsSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", ogsSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.ogsSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const bSrcId = createState.blockSourceId;

      if (!bSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", bSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", bSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", bSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.blockSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const orptsSrcId = createState.orptsIndustrialSourceId;

      if (!orptsSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", orptsSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.orptsIndustrialSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const orptsSrcId = createState.orptsResidentialSourceId;

      if (!orptsSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", orptsSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.orptsResidentialSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const orptsSrcId = createState.orptsCommercialSourceId;

      if (!orptsSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", orptsSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", orptsSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.orptsCommercialSourceId, falcor, falcorCache, pgEnv]);

    React.useEffect(() => {
      const hifldSrcId = createState.hifldSourceId;

      if (!hifldSrcId) return;

      falcor.get(["dama", pgEnv, "sources", "byId", hifldSrcId, "views", "length"]);

      const length = get(falcorCache, ["dama", pgEnv, "sources", "byId", hifldSrcId, "views", "length"], 0);

      if (length) {
        falcor.get([
          "dama", pgEnv, "sources", "byId", hifldSrcId, "views", "byIndex",
          { from: 0, to: length - 1 },
          "attributes", Object.values(ViewAttributes)
        ]);
      }
    }, [createState.hifldSourceId, falcor, falcorCache, pgEnv]);

    const parcelViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.parcelSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.parcelSourceId, pgEnv]);

    const footprintViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.footprintSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.footprintSourceId, pgEnv]);

    const elevationViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.elevationSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.elevationSourceId, pgEnv]);

    const ogsViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.ogsSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.ogsSourceId, pgEnv]);

    const blockViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.blockSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.blockSourceId, pgEnv]);

    const orptsIndustrialViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.orptsIndustrialSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.orptsIndustrialSourceId, pgEnv]);

    const orptsResidentialViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.orptsResidentialSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.orptsResidentialSourceId, pgEnv]);

    const orptsCommercialViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.orptsCommercialSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.orptsCommercialSourceId, pgEnv]);

    const hifldViews = React.useMemo(() => {
      return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", createState.hifldSourceId, "views", "byIndex"], {}))
        .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]))
        .sort((a, b) => String(a.version || a.view_id).localeCompare(String(b.version || b.view_id)));
    }, [falcorCache, createState.hifldSourceId, pgEnv]);

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
                <>
                  <SourceAndViewSelectors
                    label="Elevation"

                    sources={ elevationSources }
                    sourceKey="elevationSourceId"
                    sourceValue={ createState.elevationSourceId }

                    views={ elevationViews }
                    viewKey="elevationViewId"
                    viewValue={ createState.elevationViewId }

                    setCreateState={ setCreateState }
                  >
                    <div className="text-center pt-2 font-bold text-lg">
                      This Elevation Source must have been derived from the selected Footprint Source!
                    </div>
                  </SourceAndViewSelectors>
                </>
              )
            }

            { createState.elevationViewId && (
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
    <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
      <dt className="text-sm font-medium text-gray-500 py-5">
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
    <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
      <dt className="text-sm font-medium text-gray-500 py-5">
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
                  { v.version || `Version ${ v.view_id }` }
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
