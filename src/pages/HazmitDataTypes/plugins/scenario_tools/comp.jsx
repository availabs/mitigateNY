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


import { fnumIndex } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";

const comp = ({ state, setState }) => {
  console.log("state in comp::", state);
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
  console.log({ existingDynamicFilter, dataFilter });
  const falcorDataFilterFor500 = useMemo(() => {
    const newDataFilter = cloneDeep(dataFilter);
    newDataFilter.flood_zone.value = ["100", "500"];
    if (geography && geography.length > 0) {
      //const geoFilter = { [COUNTY_COLUMN]: { operator: "==", values: [geography[0].value], column_name: COUNTY_COLUMN } };
      //console.log({ geoFilter });
      return createFalcorFilterOptions({
        dynamicFilter: existingDynamicFilter,
        filterMode,
        dataFilter: newDataFilter,
      });
    } else {
      return JSON.stringify({});
    }
  }, [existingDynamicFilter, filterMode, dataFilter]);

  const falcorDataFilterFor100 = useMemo(() => {
    const newDataFilter = cloneDeep(dataFilter);
    newDataFilter.flood_zone.value = ["100"];
    if (geography && geography.length > 0) {
      //const geoFilter = { [COUNTY_COLUMN]: { operator: "==", values: [geography[0].value], column_name: COUNTY_COLUMN } };
      //console.log({ geoFilter });
      return createFalcorFilterOptions({
        dynamicFilter: existingDynamicFilter,
        filterMode,
        dataFilter: newDataFilter,
      });
    } else {
      return JSON.stringify({});
    }
  }, [existingDynamicFilter, filterMode, dataFilter, floodZone]);

  console.log({ falcorDataFilterFor100, falcorDataFilterFor500 });
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
  ];
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
  ];
  useEffect(() => {
    const getData = async () => {
      console.log("Getting data");
      falcor.get(bldValFalcorPath500);
      falcor.get(bldValFalcorPath100);
    };
    getData();
  }, [bldValFalcorPath100, bldValFalcorPath500]);

  const bldValData500 = useMemo(() => {
    return parseFloat(get(falcorCache, bldValFalcorPath500, 0));
  }, [falcorCache, bldValFalcorPath500]);
  console.log({ bldValData500 });
  const bldValData100 = useMemo(() => {
    return parseFloat(get(falcorCache, bldValFalcorPath100, 0));
  }, [falcorCache, bldValFalcorPath100]);
  console.log({ bldValData100 });
  //console.log({falcorDataFilter, existingDynamicFilter, dataFilter})

  //console.log({viewId, pointLayerId, countyLayerId, geography, floodZone, polygonLayerId })
  return (
    <div
      className='flex flex-col pointer-events-auto drop-shadow-lg p-4 bg-white/75'
      style={{
        position: "absolute",
        bottom: "94px",
        left: "90px",
        color: "black",
        width: "450px",
        maxHeight: "325px",
      }}
    >
      <div className='grid grid-rows-3 grid-cols-4 text-sm'>
        <div className='font-bold underline'>Scenario</div>
        <div className='font-bold underline'>Visibility</div>
        <div className='font-bold underline'>Total Loss</div>
        <div className='font-bold underline'>Annual Loss</div>

        <div>Annual 0.2%</div>
        <div>{floodZone.includes("500") && "X"}</div>
        <div>{fnumIndex(bldValData500, 1, true)}</div>
        <div>{fnumIndex(bldValData500 / 500, 2, true)}</div>

        <div>Annual 1%</div>
        <div>{!floodZone.includes("500") && "X"}</div>
        <div>{fnumIndex(bldValData100, 1, true)}</div>
        <div>{fnumIndex(bldValData100 / 100, 2, true)}</div>
      </div>

      <div className='flex space-between justify-between text-base font-bold mt-2 pl-2 pr-8'>
        <div>Expected Annualized Avg. Loss</div>
        <div>{fnumIndex(bldValData100 / 100 + bldValData500 / 500, 2, true)}</div>
      </div>
    </div>
  );
};

export { comp };
