import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store";
import { CMSContext } from "~/modules/dms/src";
import get from "lodash/get";
import set from "lodash/set";
import { Button } from "~/modules/avl-components/src";
import {
  PLUGIN_ID,
  POINT_LAYER_KEY,
  COUNTY_LAYER_KEY,
  POLYGON_LAYER_KEY,
  TOWN_LAYER_KEY,
  FLOOD_ZONE_KEY,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
} from "./constants";
import { setInitialGeomStyle, resetGeometryBorderFilter, setGeometryBorderFilter, onlyUnique } from "./utils";

import { choroplethPaint } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";

const internalPanel = ({ state, setState }) => {
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
  const { pluginDataPath, pointLayerId, countyLayerId, polygonLayerId, townLayerId } = useMemo(() => {
    const pluginDataPath = `symbology.pluginData.${PLUGIN_ID}`;
    return {
      pluginDataPath,
      pointLayerId: get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`),
      countyLayerId: get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`),
      polygonLayerId: get(state, `${pluginDataPath}['active-layers'][${POLYGON_LAYER_KEY}]`),
      townLayerId: get(state, `${pluginDataPath}['active-layers'][${TOWN_LAYER_KEY}]`),
    };
  }, [state]);

  useEffect(() => {
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
  }, [countyLayerId]);

  useEffect(() => {
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
  }, [townLayerId]);

  useEffect(() => {
    if (polygonLayerId) {
      setState(draft => {
        set(draft, `${symbologyLayerPath}['${polygonLayerId}'].hover`, "");
        set(draft, `${symbologyLayerPath}['${polygonLayerId}']['data-column']`, BLD_AV_COLUMN);
      })
    }
  }, [polygonLayerId]);

  useEffect(() => {
    if (pointLayerId) {
      setState(draft => {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['data-column']`, BLD_AV_COLUMN);
      })
    }
  }, [pointLayerId]);


  const borderLayerIds = [pointLayerId, countyLayerId, polygonLayerId, townLayerId];
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
                .filter((layerKey) => !borderLayerIds.includes(layerKey) || layerKey === pointLayerId)
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
      label: "Polygon Layer",
      controls: [
        {
          type: "select",
          params: {
            options: [
              BLANK_OPTION,
              ...Object.keys(state.symbology.layers)
                .filter((layerKey) => !borderLayerIds.includes(layerKey) || layerKey === polygonLayerId)
                .map((layerKey, i) => ({
                  value: layerKey,
                  name: state.symbology.layers[layerKey].name,
                })),
            ],
            default: "",
          },
          //the layer the plugin controls MUST use the `'active-layers'` path/field
          path: `['active-layers'][${POLYGON_LAYER_KEY}]`,
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
                .filter((layerKey) => !borderLayerIds.includes(layerKey) || layerKey === countyLayerId)
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
    {
      label: "Town Layer",
      controls: [
        {
          type: "select",
          params: {
            options: [
              BLANK_OPTION,
              ...Object.keys(state.symbology.layers)
                .filter((layerKey) => !borderLayerIds.includes(layerKey) || layerKey === townLayerId)
                .map((layerKey, i) => ({
                  value: layerKey,
                  name: state.symbology.layers[layerKey].name,
                })),
            ],
            default: "",
          },
          //the layer the plugin controls MUST use the `'active-layers'` path/field
          path: `['active-layers'][${TOWN_LAYER_KEY}]`,
        },
      ],
    },
  ];

  return controls;
};

export { internalPanel };
