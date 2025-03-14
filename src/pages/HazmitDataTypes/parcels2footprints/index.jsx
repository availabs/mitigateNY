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
            <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                <dt className="text-sm font-medium text-gray-500 py-5">
                    Select Parcel Source
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="pt-3 pr-8">
                    <select
                        value={createState.parcelSourceId}
                        onChange={e => setCreateState({...createState, parcelSourceId: e.target.value, parcelViewId: null})}
                        className='px-2 py-4 w-full bg-white shadow'
                    >
                        <option value={null}>Select Parcel Source</option>
                        {(parcelSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                    </select>
                    </div>
                </dd>
            </div>
            {createState.parcelSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Parcel Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.parcelViewId}
                                onChange={e => setCreateState({...createState, parcelViewId: e.target.value})}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Parcel Version</option>
                                {(parcelViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.parcelViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Foorprint Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.footprintSourceId}
                                onChange={e => setCreateState({...createState, footprintSourceId: e.target.value, footprintViewId: null})}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Foorprint Source</option>
                                {(footprintSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.footprintSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Footprint Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.footprintViewId}
                                onChange={e => setCreateState({...createState, footprintViewId: e.target.value})}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Foorprint Version</option>
                                {(footprintViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.footprintViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Elevation Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.elevationSourceId}
                                onChange={e => setCreateState({...createState, elevationSourceId: e.target.value, elevationViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Elevation Source</option>
                                {(elevationSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.footprintViewId && (
              <div className="px-8 py-2">
                This Elevation Source must have been derived from the selected Footprint Source
              </div>
            )}
            {createState.elevationSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Elevation Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.elevationViewId}
                                onChange={e => setCreateState({...createState, elevationViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Elevation Version</option>
                                {(elevationViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.elevationViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select OGS Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.ogsSourceId}
                                onChange={e => setCreateState({...createState, ogsSourceId: e.target.value, ogsViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select OGS Source</option>
                                {(ogsSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.ogsSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select OGS Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.ogsViewId}
                                onChange={e => setCreateState({...createState, ogsViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select OGS Version</option>
                                {(ogsViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.ogsViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Block Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.blockSourceId}
                                onChange={e => setCreateState({...createState, blockSourceId: e.target.value, blockViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Block Source</option>
                                {(blockSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.blockSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select Block Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.blockViewId}
                                onChange={e => setCreateState({...createState, blockViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select Block Version</option>
                                {(blockViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.blockViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Industrial Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsIndustrialSourceId}
                                onChange={e => setCreateState({...createState, orptsIndustrialSourceId: e.target.value, orptsIndustrialViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Source</option>
                                {(orptsSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.orptsIndustrialSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Industrial Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsIndustrialViewId}
                                onChange={e => setCreateState({...createState, orptsIndustrialViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Version</option>
                                {(orptsIndustrialViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.orptsIndustrialViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Residential Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsResidentialSourceId}
                                onChange={e => setCreateState({...createState, orptsResidentialSourceId: e.target.value, orptsResidentialViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Source</option>
                                {(orptsSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.orptsResidentialSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Residential Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsResidentialViewId}
                                onChange={e => setCreateState({...createState, orptsResidentialViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Version</option>
                                {(orptsResidentialViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.orptsResidentialViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Commercial Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsCommercialSourceId}
                                onChange={e => setCreateState({...createState, orptsCommercialSourceId: e.target.value, orptsCommercialViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Source</option>
                                {(orptsSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.orptsCommercialSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select ORPTS Commercial Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.orptsCommercialViewId}
                                onChange={e => setCreateState({...createState, orptsCommercialViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select ORPTS Version</option>
                                {(orptsCommercialViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {createState.orptsCommercialViewId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select HIFLD Source
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.hifldSourceId}
                                onChange={e => setCreateState({...createState, hifldSourceId: e.target.value, hifldViewId: null })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select HIFLD Source</option>
                                {(hifldSources || []).map(s => <option value={s.source_id} key={s.source_id}>{s.name}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}
            {createState.hifldSourceId && (
                <div className="flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t mt-2">
                    <dt className="text-sm font-medium text-gray-500 py-5">
                        Select HIFLD Version
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="pt-3 pr-8">
                            <select
                                value={createState.hifldViewId}
                                onChange={e => setCreateState({...createState, hifldViewId: e.target.value })}
                                className='px-2 py-4 w-full bg-white shadow'
                            >
                                <option value={null}>Select HIFLD Version</option>
                                {(hifldViews || []).map(s => <option value={s.view_id} key={s.view_id}>{s.version || s.view_id}</option>)}
                            </select>
                        </div>
                    </dd>
                </div>
            )}

            {canSubmit && (
                <div className='w-full flex p-4'>
                    <div className='flex-1' />
                    <div>
                        <button
                          className="rounded-md p-2 border-2 border-blue-300 bg-blue-500 shadow hover:shadow-lg text-slate-100 hover:bg-blue-700"
                          disabled={ !canSubmit }
                          onClick={submit}
                        >
                            Process
                        </button>
                    </div>
                </div>
            )}
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
