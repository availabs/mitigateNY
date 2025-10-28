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
  COUNTY_COLUMN,
  TOWN_LAYER_KEY
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
import {comp as scenarioToolComp} from "./comp";
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

    const countyLayerId = get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`);
    const townLayerId = get(state, `${pluginDataPath}['active-layers'][${TOWN_LAYER_KEY}]`);
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
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
        }
      }
      if(polygonLayerId) {
        //this is a sketchy way of pulling more data
        //since we don't actually want to filter it or anything
        set(draft, `${symbologyLayerPath}['${polygonLayerId}']['data-column']`, `${BLD_AV_COLUMN},${FLOOD_ZONE_COLUMN}`);
        if(geography && geography.length > 0) {
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
        }
      }
    });
    if (countyLayerId) {
      setInitialGeomStyle({
        setState,
        layerId: countyLayerId,
        layerBasePath: symbologyLayerPath,
      });

      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${countyLayerId}'].hover`, "");
      });
    }
    if (townLayerId) {
      setInitialGeomStyle({
        setState,
        layerId: townLayerId,
        layerBasePath: symbologyLayerPath,
      });

      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${townLayerId}'].hover`, "");
      });
    }

    const MAP_CLICK = (e) => {
      console.log("map was clicked, e::", e);
    };

    map.on("click", MAP_CLICK);
  },
  dataUpdate: (map, state, setState) => {

  },
  internalPanel: internalPanel,
  externalPanel: externalPanel,
  comp: scenarioToolComp,
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
