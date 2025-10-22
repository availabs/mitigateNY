import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store"
import { CMSContext } from "~/modules/dms/src";
import get from "lodash/get";
import set from "lodash/set";

import { cloneDeep } from "lodash-es";

import { Button } from "~/modules/avl-components/src";
import {
  PLUGIN_ID,
  POINT_LAYER_KEY,
  FLOOD_ZONE_COLUMN,
  COUNTY_LAYER_KEY,
  FLOOD_ZONE_KEY,
  GEOGRAPHY_KEY,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
  POLYGON_LAYER_KEY,
  COUNTY_COLUMN
} from "./constants";
import {
  setPolygonLayerStyle,
  setPointLayerStyle,
  setInitialGeomStyle,
  resetGeometryBorderFilter,
  setGeometryBorderFilter,
  onlyUnique
} from "./utils"

import { externalPanel } from "./externalPanel";
import { internalPanel } from "./internalPanel";
import { fnumIndex } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";

/**
 * PLUGIN STRUCTURE:
 * {
 *    id: "pluginid",
 *    type: "plugin",
 *    mapRegister: (map, state, setState) => { returns null; }
 *      // stuff to do when plugin is initialized. only runs once
 *      // runs within a hook, so it CANNOT use hooks itself (i.e. no useMemo, useEffect, useState, etc.)
 *    dataUpdate: (map, state, setState) => { returns null; }
 *      // fires when symbology.pluginData['${pluginid}'] changes
 *      // runs within a hook, so it CANNOT use hooks itself (i.e. no useMemo, useEffect, useState, etc.)
 *    comp: ({ state, setState }) => { returns React component; }
 *      // can use "position:absolute" to place anywhere, render anything, etc.
 *      // can use hooks
 *    internalPanel : ({ state, setState }) => { returns array of json; }
 *      // json describes the `formControls` for use within MapEditor
 *      // can use hooks
 *    externalPanel : ({ state, setState }) => { returns array of json; }
 *      // json describes the `formControls` for end user in DMS
 *      // panel position can be set within DMS
 *      // can use hooks
 *    cleanup: (map, state, setState) => { returns null; }
 *      // if plugin is removed, this should undo any changes made directly to the map (i.e. custom on-click)
 *      // runs within a hook, so it CANNOT use hooks itself (i.e. no useMemo, useEffect, useState, etc.)
 * }
 * NOTES:
 *  All components (except for `internalPanel`) must work in both MapEditor and DMS
 *    This generally means 2 things:
 *      You need to dynamically determine the `symbology` and/or `pluginData` path
 *      You need to dynamically determine which context to use (for falcor, mostly)
 *    There are examples in the `macroview` plugin
 */


/**
 * Some ideas:
 * If user clicks button, `point selector` mode is enabled/disabled
 * If enabled, map click adds the lng/lat to state var
 * When user clicks `calculate route` button, it sends to "API"
 *
 * EVENTUALLY -- will prob want to have internal panel control that can set activeLayer
 * And mapClick will only allow user to pick lng/lat that is in activeLayer
 * Perhaps it will snap to closest or something?
 */

let MARKERS = [];
export const ScenarioToolsPlugin = {
  id: PLUGIN_ID,
  type: "plugin",
  mapRegister: (map, state, setState) => {
    console.log("map register hello world scenarioTools");

    let pluginDataPath = "";
    let symbologyLayerPath = "";
    let symbPath = "";
    //state.symbologies indicates that the map context is DMS
    if (state.symbologies) {
      const symbName = Object.keys(state.symbologies)[0];
      const pathBase = `symbologies['${symbName}']`;
      symbologyLayerPath = `${pathBase}.symbology.layers`;
      pluginDataPath = `${pathBase}.symbology.pluginData.${PLUGIN_ID}`;
      symbPath = `${pathBase}.symbology`;
    } else {
      symbologyLayerPath = `symbology.layers`;
      pluginDataPath = `symbology.pluginData.${PLUGIN_ID}`;
      symbPath = `symbology`;
    }

    const pointLayerId = get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`);
    const polygonLayerId = get(state, `${pluginDataPath}['active-layers'][${POLYGON_LAYER_KEY}]`);
    const geography = get(state, `${pluginDataPath}['${GEOGRAPHY_KEY}']`)

    if(pointLayerId) {
      setPointLayerStyle({setState, layerId: pointLayerId, layerBasePath: symbologyLayerPath})
    }
    if(polygonLayerId) {
      setPolygonLayerStyle({setState, layerId: polygonLayerId, layerBasePath: symbologyLayerPath, floodZone:"100"})
    }
    setState((draft) => {
      set(draft, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`, "100");
      if (pointLayerId) {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['data-column']`, BLD_AV_COLUMN);
        if(geography && geography.length > 0) {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, true);
        }
      }
      if(polygonLayerId) {
        //this is a sketchy way of pulling more data
        //since we don't actually want to filter it or anything
        set(draft, `${symbologyLayerPath}['${polygonLayerId}']['data-column']`, `${BLD_AV_COLUMN},${FLOOD_ZONE_COLUMN}`);
        if(geography && geography.length > 0) {
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, true);
        }
      }
    });

    const MAP_CLICK = (e) => {
      console.log("map was clicked, e::", e);
    };

    map.on("click", MAP_CLICK);
  },
  dataUpdate: (map, state, setState) => {

  },
  internalPanel: internalPanel,
  externalPanel: externalPanel,
  comp: ({ state, setState }) => {
    console.log("state in comp::", state)
    const dctx = useContext(DamaContext);
    const cctx = useContext(CMSContext);
    const ctx = dctx?.falcor ? dctx : cctx;
    let { falcor, falcorCache, pgEnv, baseUrl } = ctx;

    if (!falcorCache) {
      falcorCache = falcor.getCache();
    }
    let symbologyLayerPath = "";
    let symbPath = "";
    if (state.symbologies) {
      const symbName = Object.keys(state.symbologies)[0];
      const pathBase = `symbologies['${symbName}']`;
      symbologyLayerPath = `${pathBase}.symbology.layers`;

      symbPath = `${pathBase}.symbology`;
    } else {
      symbologyLayerPath = `symbology.layers`;
      symbPath = `symbology`;
    }

    const pluginDataPath = `${symbPath}['pluginData']['${PLUGIN_ID}']`;

    const { viewId, pointLayerId, countyLayerId, geography, floodZone, polygonLayerId } = useMemo(() => {
      const pointLayerId = get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`);

      return {
        viewId: get(state, `${symbologyLayerPath}['${pointLayerId}']['view_id']`, null),
        pointLayerId,
        geography: get(state, `${pluginDataPath}['geography']`, null),
        countyLayerId: get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`),
        polygonLayerId: get(state, `${pluginDataPath}['active-layers'][${POLYGON_LAYER_KEY}]`),
        floodZone: get(state, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`),
      };
    }, [state]);
    const {
      symbology_id,
      existingDynamicFilter,
      filter: dataFilter,
      filterMode,
    } = useMemo(() => {
      if (dctx) {
        return extractState(state);
      } else {
        const symbName = Object.keys(state.symbologies)[0];
        const symbPathBase = `symbologies['${symbName}']`;
        const symbData = get(state, symbPathBase, {});
        return extractState(symbData);
      }
    }, [state]);
    console.log({existingDynamicFilter, dataFilter})
    const falcorDataFilterFor500 = useMemo(() => {
      const newDataFilter = cloneDeep(dataFilter)
      newDataFilter.flood_zone.value=["100", "500"]
      if (geography && geography.length > 0) {
        //const geoFilter = { [COUNTY_COLUMN]: { operator: "==", values: [geography[0].value], column_name: COUNTY_COLUMN } };
        //console.log({ geoFilter });
        return createFalcorFilterOptions({
          dynamicFilter: existingDynamicFilter,
          filterMode,
          dataFilter: newDataFilter
        });
      } else {
        return JSON.stringify({})
      }
    }, [existingDynamicFilter, filterMode, dataFilter]);

    const falcorDataFilterFor100 = useMemo(() => {
      const newDataFilter = cloneDeep(dataFilter)
      newDataFilter.flood_zone.value=["100"]
      if (geography && geography.length > 0) {
        //const geoFilter = { [COUNTY_COLUMN]: { operator: "==", values: [geography[0].value], column_name: COUNTY_COLUMN } };
        //console.log({ geoFilter });
        return createFalcorFilterOptions({
          dynamicFilter: existingDynamicFilter,
          filterMode,
          dataFilter: newDataFilter
        });
      } else {
        return JSON.stringify({})
      }
    }, [existingDynamicFilter, filterMode, dataFilter, floodZone]);

    console.log({falcorDataFilterFor100, falcorDataFilterFor500})
    const options100 = JSON.stringify({
      filter: JSON.parse(falcorDataFilterFor100).filter,
    });
    const options500 = JSON.stringify({
      filter: JSON.parse(falcorDataFilterFor500).filter,
    });
    const bldValFalcorPath500 = [
        "uda",
        pgEnv,
        "viewsById",
        viewId,
        "options",
        options500,
        "dataByIndex",
        0,
        [`sum(${BLD_AV_COLUMN}) as sum`],
      ]
    const bldValFalcorPath100 = [
      "uda",
      pgEnv,
      "viewsById",
      viewId,
      "options",
      options100,
      "dataByIndex",
      0,
      [`sum(${BLD_AV_COLUMN}) as sum`],
    ]
    useEffect(() => {
      const getData = async () => {
        console.log("Getting data")
        falcor.get(bldValFalcorPath500)
        falcor.get(bldValFalcorPath100)
      };
      getData();
    }, [bldValFalcorPath100, bldValFalcorPath500]);


    const bldValData500 = useMemo(() => {
      return parseFloat(get(falcorCache, bldValFalcorPath500, 0))
    }, [falcorCache, bldValFalcorPath500])
    console.log({bldValData500})
    const bldValData100 = useMemo(() => {
      return parseFloat(get(falcorCache, bldValFalcorPath100, 0))
    }, [falcorCache, bldValFalcorPath100])
    console.log({bldValData100})
    //console.log({falcorDataFilter, existingDynamicFilter, dataFilter})

    //console.log({viewId, pointLayerId, countyLayerId, geography, floodZone, polygonLayerId })
    return       (<div
        className="flex flex-col pointer-events-auto drop-shadow-lg p-4 bg-white/75"
        style={{
          position: "absolute",
          bottom: "94px",
          left: "90px",
          color: "black",
          width: "450px",
          maxHeight: "325px",
        }}
      >
        <div className="grid grid-rows-3 grid-cols-4 text-sm">
      
            <div className="font-bold underline">Scenario</div>
            <div className="font-bold underline">Visibility</div>
            <div className="font-bold underline">Total Loss</div>
            <div className="font-bold underline">Annual Loss</div>
       
            <div>Annual 0.2%</div>
            <div>{floodZone.includes("500") && "X"}</div>
            <div>{fnumIndex(bldValData500, 1, true)}</div>
            <div>{fnumIndex((bldValData500 / 500), 2, true)}</div>
     
            <div>Annual 1%</div>
            <div>{!floodZone.includes("500") && "X"}</div>
            <div>{fnumIndex(bldValData100, 1, true)}</div>
            <div>{fnumIndex((bldValData100 / 100), 2, true) }</div>
          
        </div>

      <div className="flex space-between justify-between text-base font-bold mt-2 pl-2 pr-8">
        <div>Expected Annualized Avg. Loss</div>
        <div>{fnumIndex(((bldValData100 / 100) + (bldValData500 / 500)), 2, true)}</div>
      </div>

      </div>)
  },
  cleanup: (map, state, setState) => {
    //map.off("click", "point-selector");
  },
};

const precisionRound = (number, precision = 0) => {
  if (number === null) {
    return null;
  }
  if (!Number.isFinite(+number)) {
    return NaN;
  }

  const factor = 10 ** precision;

  return Math.round(+number * factor) / factor;
};

const resetPointsAndMarkers = ({ setState, pluginDataPath }) => {
  setState((draft) => {
    MARKERS.forEach((mark) => {
      mark?.remove && mark?.remove();
    });
    MARKERS = [];
    set(draft, `${pluginDataPath}['points']`, []);
  });
};
