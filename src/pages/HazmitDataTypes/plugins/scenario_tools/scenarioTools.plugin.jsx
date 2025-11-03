import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store";
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
  TOWN_LAYER_KEY,
  FLOODPLAIN_LAYER_KEY,
  FLOODPLAIN_ZONE_COLUMN,
  FLOODPLAIN_2ND_ZONE_COLUMN,
  FLOODPLAIN_COUNTY_COLUMN,
} from "./constants";
import {
  setPolygonLayerStyle,
  setPointLayerStyle,
  setInitialGeomStyle,
  resetGeometryBorderFilter,
  setGeometryBorderFilter,
  onlyUnique,
} from "./utils";

import { externalPanel } from "./externalPanel";
import { internalPanel } from "./internalPanel";
import { comp as scenarioToolComp } from "./comp";
import { fnumIndex } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";


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
    const floodplainLayerId = get(state, `${pluginDataPath}['active-layers'][${FLOODPLAIN_LAYER_KEY}]`);
    const countyLayerId = get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`);
    const townLayerId = get(state, `${pluginDataPath}['active-layers'][${TOWN_LAYER_KEY}]`);
    const geography = get(state, `${pluginDataPath}['${GEOGRAPHY_KEY}']`);

    if (pointLayerId) {
      setPointLayerStyle({ setState, layerId: pointLayerId, layerBasePath: symbologyLayerPath });
    }
    if (polygonLayerId) {
      setPolygonLayerStyle({ setState, layerId: polygonLayerId, layerBasePath: symbologyLayerPath, floodZone: "100" });
    }
    setState((draft) => {
      set(draft, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`, "100");
      if (pointLayerId) {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['data-column']`, BLD_AV_COLUMN);
        if (geography && geography.length > 0) {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
        }
      }
      if (polygonLayerId) {
        //this is a sketchy way of pulling more data
        //since we don't actually want to filter it or anything
        set(draft, `${symbologyLayerPath}['${polygonLayerId}']['data-column']`, `${BLD_AV_COLUMN},${FLOOD_ZONE_COLUMN}`);
        if (geography && geography.length > 0) {
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
        }
      }
    });
    if (countyLayerId) {
      if (geography && geography.length === 0) {
        setInitialGeomStyle({
          setState,
          layerId: countyLayerId,
          layerBasePath: symbologyLayerPath,
        });
      }

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
    if (floodplainLayerId) {
      setState((draft) => {
        set(
          draft,
          `${symbologyLayerPath}['${floodplainLayerId}']['data-column']`,
          `${FLOODPLAIN_COUNTY_COLUMN},${FLOODPLAIN_ZONE_COLUMN},${FLOODPLAIN_2ND_ZONE_COLUMN}`
        );
      });
    }

    const MAP_CLICK = (e) => {
      console.log("map was clicked, e::", e);
    };

    map.on("click", MAP_CLICK);
  },
  dataUpdate: (map, state, setState) => {},
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
