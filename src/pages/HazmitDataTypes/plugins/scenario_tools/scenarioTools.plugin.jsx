import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store"
import { CMSContext } from "~/modules/dms/src";
import get from "lodash/get";
import set from "lodash/set";
import { Button } from "~/modules/avl-components/src";
import {
  POINT_LAYER_KEY,
  COUNTY_LAYER_KEY,
  FLOOD_ZONE_KEY,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS
} from "./constants";
import {
  setInitialGeomStyle,
  resetGeometryBorderFilter,
  setGeometryBorderFilter,
  onlyUnique
} from "./utils"

import { externalPanel } from "./externalPanel";
import { choroplethPaint } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
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

const PLUGIN_ID = "scenarioTools";
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

    setState((draft) => {
      if (pointLayerId) {
        //TODO eventually need to filter via page param, not just default

        // set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, defaultFilter);
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['data-column']`, BLD_AV_COLUMN);
        set(draft, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`, "100");

        //if we have the point layer, set paint prop
        //TODO -- could maybe actual move this to `internalPanel`, since it only changes when pointLayerId changes, which is only internally
        const numbins = 6,
          method = "ckmeans";
        const showOther = "#ccc";
        let { paint, legend } = choroplethPaint(
          BLD_AV_COLUMN,
          COLOR_SCALE_MAX,
          getColorRange(8, "YlGn"),
          numbins,
          method,
          COLOR_SCALE_BREAKS,
          showOther,
          "horizontal"
        );

        set(draft, `${symbologyLayerPath}['${pointLayerId}']['layers'][0]['paint']`, { "circle-color": paint }); //Mapbox paint
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['legend-data']`, legend); //AVAIL-written legend component
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['legend-orientation']`, "horizontal");
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['category-show-other']`, "#fff");
      }
    });

    const MAP_CLICK = (e) => {
      console.log("map was clicked, e::", e);
    };

    map.on("click", MAP_CLICK);
  },
  dataUpdate: (map, state, setState) => {

  },
  internalPanel: ({ state, setState }) => {
    const { falcor, falcorCache, pgEnv, baseUrl } = useContext(DamaContext);
    // console.log("internal panel state::", state)
    //if a layer is selected, use the source_id to get all the associated views
    let symbologyLayerPath = "";
    if (state.symbologies) {
      const symbName = Object.keys(state.symbologies)[0];
      const pathBase = `symbologies['${symbName}']`;
      symbologyLayerPath = `${pathBase}.symbology.layers`;
    } else {
      symbologyLayerPath = `symbology.layers`;
    }
    const {
      pluginDataPath,
      pointLayerId,
      countyLayerId
    } = useMemo(() => {
      const pluginDataPath = `symbology.pluginData.${PLUGIN_ID}`;
      return {
        pluginDataPath,
        pointLayerId: get(
          state,
          `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`
        ),
        countyLayerId: get(
          state,
          `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`
        )
      };
    }, [state]);

    useEffect(() => {
      if (countyLayerId) {
        setInitialGeomStyle({
          setState,
          layerId: countyLayerId,
          layerBasePath: symbologyLayerPath,
        });

        setState(draft => {
          set(draft, `${symbologyLayerPath}['${countyLayerId}'].hover`, "");
        })
      }
    }, [countyLayerId]);

    const borderLayerIds = [pointLayerId, countyLayerId];
    const controls = [
      {
        label: "Point Layer",
        controls: [
          {
            type: "select",
            params: {
              options: [
                BLANK_OPTION,
                ...Object.keys(state.symbology.layers)
                  .filter(
                    (layerKey) =>
                      !borderLayerIds.includes(layerKey) ||
                      layerKey === pointLayerId
                  )
                  .map((layerKey, i) => ({
                    value: layerKey,
                    name: state.symbology.layers[layerKey].name,
                  })),
              ],
              default: "",
            },
            //the layer the plugin controls MUST use the `'active-layers'` path/field
            path: `['active-layers'][${POINT_LAYER_KEY}]`,
          },
        ],
      },
      {
        label: "County Layer",
        controls: [
          {
            type: "select",
            params: {
              options: [
                BLANK_OPTION,
                ...Object.keys(state.symbology.layers)
                  .filter(
                    (layerKey) =>
                      !borderLayerIds.includes(layerKey) ||
                      layerKey === countyLayerId
                  )
                  .map((layerKey, i) => ({
                    value: layerKey,
                    name: state.symbology.layers[layerKey].name,
                  })),
              ],
              default: "",
            },
            //the layer the plugin controls MUST use the `'active-layers'` path/field
            path: `['active-layers'][${COUNTY_LAYER_KEY}]`,
          },
        ],
      },
    ];

    return controls;
  },
  externalPanel: externalPanel,
  comp: ({ state, setState }) => {
    return <> </>
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
