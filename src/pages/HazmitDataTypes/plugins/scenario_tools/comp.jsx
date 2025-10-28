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
  TOWNS_KEY,
  BILD_MUNI_COLUMN,
  GEOGRAPHY_KEY,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
  POLYGON_LAYER_KEY,
  COUNTY_COLUMN,
} from "./constants";
import {
  setPolygonLayerStyle,
  setPointLayerStyle,
  setInitialGeomStyle,
  resetGeometryBorderFilter,
  setGeometryBorderFilter,
  onlyUnique,
} from "./utils";

import { fnumIndex } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";
import { count } from "d3-array";

const comp = ({ state, setState }) => {
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

  const {
    viewId,
    pointLayerId,
    countyLayerId,
    geography,
    floodZone,
    polygonLayerId,
    towns,
    filter: dataFilter,
    existingDynamicFilter,
    filterMode,
  } = useMemo(() => {
    const pointLayerId = get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`);

    return {
      viewId: get(state, `${symbologyLayerPath}['${pointLayerId}']['view_id']`, null),
      pointLayerId,
      geography: get(state, `${pluginDataPath}['geography']`, null),
      countyLayerId: get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`),
      polygonLayerId: get(state, `${pluginDataPath}['active-layers'][${POLYGON_LAYER_KEY}]`),
      floodZone: get(state, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`),
      towns: get(state, `${pluginDataPath}['${TOWNS_KEY}']`),
      filter: get(state, `${symbologyLayerPath}['${pointLayerId}']['filter']`, {}),
      existingDynamicFilter: get(state, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters']`),
      filterMode: get(state, `${symbologyLayerPath}['${pointLayerId}']['filterMode']`, "and"),
    };
  }, [state]);
  // const {
  //   symbology_id,
  //   filterMode,
  // } = useMemo(() => {
  //   if (dctx) {
  //     return extractState(state);
  //   } else {
  //     const symbName = Object.keys(state.symbologies)[0];
  //     const symbPathBase = `symbologies['${symbName}']`;
  //     const symbData = get(state, symbPathBase, {});
  //     return extractState(symbData);
  //   }
  // }, [state]);

  const falcorDataFilterForCountyLoss = useMemo(() => {
    if (geography && geography.length > 0 && dataFilter.flood_zone) {
      const newDataFilter = cloneDeep(dataFilter);
      newDataFilter.flood_zone.value = ["100", "500"];
      //const geoFilter = { [COUNTY_COLUMN]: { operator: "==", values: [geography[0].value], column_name: COUNTY_COLUMN } };
      return createFalcorFilterOptions({
        dynamicFilter: existingDynamicFilter,
        filterMode,
        dataFilter: newDataFilter,
      });
    } else {
      return JSON.stringify({});
    }
  }, [existingDynamicFilter, filterMode, dataFilter]);

  const falcorDataFilterForTowns = useMemo(() => {
    if (towns && towns.length > 0 && dataFilter.flood_zone) {
      const newDataFilter = cloneDeep(dataFilter);
      newDataFilter.flood_zone.value = ["100", "500"];
      const geoFilter = [{ column_name: BILD_MUNI_COLUMN, values: towns.map((town) => town.value) }];
      return createFalcorFilterOptions({
        dynamicFilter: geoFilter,
        filterMode,
        dataFilter: [],
      });
    } else {
      return JSON.stringify({});
    }
  }, [existingDynamicFilter, filterMode, dataFilter, towns]);

  const countyLossOptions = useMemo(() => {
    return JSON.stringify({
      groupBy: [FLOOD_ZONE_COLUMN],
      filter: JSON.parse(falcorDataFilterForCountyLoss).filter,
    });
  }, [falcorDataFilterForCountyLoss]);

  const optionsTowns = useMemo(() => {
    return JSON.stringify({
      groupBy: [BILD_MUNI_COLUMN, FLOOD_ZONE_COLUMN],
      filter: JSON.parse(falcorDataFilterForTowns).filter,
    });
  }, [falcorDataFilterForTowns]);

  const countyLossFalcorPath = useMemo(() => {
    return ["uda", pgEnv, "viewsById", viewId, "options", countyLossOptions, "dataByIndex"];
  }, [pgEnv, viewId, countyLossOptions]);
  const bldValFalcorPathTowns = useMemo(() => {
    return ["uda", pgEnv, "viewsById", viewId, "options", optionsTowns, "dataByIndex"];
  }, [pgEnv, viewId, optionsTowns]);

  const countyLossApiPath = [{ from: 0, to: 1 }, [FLOOD_ZONE_COLUMN, `sum(${BLD_AV_COLUMN}) as sum`]];
  const townsLossApiPath = [
    { from: 0, to: 20 },
    [BILD_MUNI_COLUMN, FLOOD_ZONE_COLUMN, "count(1)::int as count", `sum(${BLD_AV_COLUMN}) as sum`],
  ];
  useEffect(() => {
    const getData = async () => {
      falcor.get([...countyLossFalcorPath, ...countyLossApiPath]);

      if (towns && towns.length > 0) {
        falcor.get([...bldValFalcorPathTowns, ...townsLossApiPath]);
      }
    };
    getData();
  }, [bldValFalcorPathTowns, countyLossFalcorPath]);

  const countyLossData = useMemo(() => {
    return get(falcorCache, countyLossFalcorPath);
  }, [falcorCache, countyLossFalcorPath]);
  const townData = useMemo(() => {
    const rawTowns = get(falcorCache, bldValFalcorPathTowns);
    //find 3 objects with this town name (flood 100, flood 500, flood none)
    //return 1 object for town
    //towns is the currenty selection of towns
    return towns?.reduce((acc, curr) => {
      acc[curr.value] = Object.values(rawTowns || {}).filter((rt) => rt[BILD_MUNI_COLUMN] === curr.value);
      return acc;
    }, {});
  }, [falcorCache, bldValFalcorPathTowns]);

  const county100Year = parseFloat(
    Object.values(countyLossData || {}).find((row) => row[FLOOD_ZONE_COLUMN] === "100")?.[`sum(${BLD_AV_COLUMN}) as sum`]
  );
  const county500Year = parseFloat(
    Object.values(countyLossData || {}).find((row) => row[FLOOD_ZONE_COLUMN] === "500")?.[`sum(${BLD_AV_COLUMN}) as sum`]
  );

  return (
    <div
      className='flex flex-col pointer-events-auto drop-shadow-lg p-4 bg-white/95'
      style={{
        position: "absolute",
        bottom: "150px",
        left: "90px",
        color: "black",
        width: "450px",
        maxHeight: "500px",
      }}
    >
      <div className='grid grid-rows-3 text-sm divide-y divide-gray-400'>
        <div className='grid grid-cols-4 border-gray-400 border-b p-1 '>
          <div className='font-bold'>Scenario</div>
          <div className='font-bold'>Visibility</div>
          <div className='font-bold'>Total Loss</div>
          <div className='font-bold'>Annual Loss</div>
        </div>

        <div className='grid grid-cols-4 p-1 '>
          <div>Annual 0.2%</div>
          <div>
            <input
              type='radio'
              checked={floodZone?.includes("500")}
              onChange={() =>
                setState((draft) => {
                  set(draft, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`, "500");
                })
              }
            />
          </div>
          <div>{fnumIndex(county100Year + county500Year, 1, true)}</div>
          <div>{fnumIndex((county100Year + county500Year) / 500, 2, true)}</div>
        </div>

        <div className='grid grid-cols-4 p-1 '>
          <div>Annual 1%</div>
          <div>
            {" "}
            <input
              type='radio'
              checked={!floodZone?.includes("500")}
              onChange={() =>
                setState((draft) => {
                  set(draft, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`, "100");
                })
              }
            />
          </div>
          <div>{fnumIndex(county100Year, 1, true)}</div>
          <div>{fnumIndex(county100Year / 100, 2, true)}</div>
        </div>
      </div>

      <div className='flex space-between justify-between text-base font-bold pl-2 pr-8'>
        <div>Expected Annualized Avg. Loss</div>
        <div>{fnumIndex(county100Year / 100 + county500Year / 500, 2, true)}</div>
      </div>
      {towns?.length ? (
        <div className='mt-8'>
          <div className='font-xl font-bold'>Jurisdictions</div>
          <div className='grid grid-rows-3 text-sm divide-y divide-gray-400'>
            <div className='grid grid-cols-5 border-gray-400 border-b p-1 '>
              <div className='font-bold'>Zone</div>
              <div className='font-bold'># of bld</div>
              <div className='font-bold'>$ of bld</div>
              <div className='font-bold'># bld in flood zone</div>
              <div className='font-bold'>$ of bld in zone</div>
            </div>

            {Object.keys(townData).map((townName) => {
              const town = townData[townName];

              const townTotalBld = Object.values(town).reduce((acc, curr) => {
                return acc + parseInt(curr["count(1)::int as count"]);
              }, 0);
              const townTotalVal = Object.values(town).reduce((acc, curr) => {
                return acc + parseFloat(curr[`sum(${BLD_AV_COLUMN}) as sum`]);
              }, 0);

              let townFloodLoss = 0;
              const loss100 = parseInt(Object.values(town).find((row) => row[FLOOD_ZONE_COLUMN] === "100")?.[`sum(${BLD_AV_COLUMN}) as sum`]);
              if (!floodZone?.includes("500")) {
                // 100 only
                townFloodLoss = loss100;
              } else {
                const loss500 = parseInt(Object.values(town).find((row) => row[FLOOD_ZONE_COLUMN] === "500")?.[`sum(${BLD_AV_COLUMN}) as sum`]);
                townFloodLoss = loss100 + loss500;
              }

              let townFloodBld = 0;
              const count100 = parseInt(Object.values(town).find((row) => row[FLOOD_ZONE_COLUMN] === "100")?.["count(1)::int as count"]);
              if (!floodZone?.includes("500")) {
                // 100 only
                townFloodBld =  count100;
              } else {
                const count500 = parseInt(Object.values(town).find((row) => row[FLOOD_ZONE_COLUMN] === "500")?.["count(1)::int as count"]);
                townFloodBld = count100 + count500;
              }

              return (
                <div className='grid grid-cols-5 p-1 ' key={`town_${townName}`}>
                  <div>{townName}</div>
                  <div>{fnumIndex(townTotalBld, 2)}</div>
                  <div>{fnumIndex(townTotalVal, 2, true)}</div>
                  <div>{fnumIndex(townFloodBld, 2)}</div>
                  <div>{fnumIndex(townFloodLoss, 2, true)}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export { comp };
