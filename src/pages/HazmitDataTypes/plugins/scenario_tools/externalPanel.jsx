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

import { choroplethPaint } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";

const externalPanel = ({ state, setState, pathBase = "" }) => {
  const dctx = useContext(DamaContext);
  const cctx = useContext(CMSContext);
  const ctx = dctx?.falcor ? dctx : cctx;
  let { falcor, falcorCache, pgEnv, baseUrl } = ctx;

  if (!falcorCache) {
    falcorCache = falcor.getCache();
  }
  //const {falcor, falcorCache, pgEnv, baseUrl} = React.useContext(DamaContext);
  //performence measure (speed, lottr, tttr, etc.) (External Panel) (Dev hard-code)
  //"second" selection (percentile, amp/pmp) (External Panel) (dependent on first selection, plus dev hard code)
  const pluginDataPath = `${pathBase}`;

  const pluginData = useMemo(() => {
    return get(state, pluginDataPath, {});
  }, [state]);

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

  const { viewId, pointLayerId, countyLayerId, geography, floodZone } = useMemo(() => {
    const pointLayerId = get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`);
    return {
      viewId: get(state, `${symbologyLayerPath}['${pointLayerId}']['view_id']`, null),
      pointLayerId,
      geography: get(state, `${pluginDataPath}['geography']`, null),
      countyLayerId: get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`),
      floodZone: get(state, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`),
    };
  }, [pluginData, pluginDataPath]);

  //TODO eventually need to filter via page param, not just default
  useEffect(() => {
    if (pointLayerId) {
      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, defaultFilter);
      });
    }
  }, [pointLayerId]);

  // const {
  //   symbology_id,
  //   existingDynamicFilter,
  //   filter: dataFilter,
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


  const geomOptions = JSON.stringify({
    groupBy: ["county_name"],
  });
  useEffect(() => {
    const getGeoms = async () => {
      await falcor.get(["dama", pgEnv, "viewsbyId", viewId, "options", geomOptions, "databyIndex", { from: 0, to: 200 }, ["county_name"]]);
    };

    if (viewId) {
      getGeoms();
    }
  }, [viewId]);

  const geomControlOptions = useMemo(() => {
    const geomData = get(falcorCache, ["dama", pgEnv, "viewsbyId", viewId, "options", geomOptions, "databyIndex"]);
    if (geomData) {
      const geoms = {
        county_name: [],
      };

      Object.values(geomData).forEach((da) => {
        geoms.county_name.push(da.county_name);
      });

      const nameSort = (a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          return 1;
        }
      };
      const objectFilter = (da) => typeof da !== "object";
      const truthyFilter = (val) => !!val;
      geoms.county_name = geoms.county_name
        .filter(onlyUnique)
        .filter(objectFilter)
        .filter(truthyFilter)
        .map((da) => ({
          name: da.toLowerCase() + " County",
          value: da,
          type: "county_name",
        }))
        .sort(nameSort);

      return [...geoms.county_name];
    } else {
      return [];
    }
  }, [falcorCache]);

  useEffect(() => {
    const getFilterBounds = async () => {
      //need array of [{column_name:foo, values:['bar', 'baz']}]
      //geography is currently [{name: foo, value: 'bar', type:'baz'}]
      //loop thru, gather like terms
      const selectedGeographyByType = geography.reduce((acc, curr) => {
        if (!acc[curr.type]) {
          acc[curr.type] = [];
        }
        acc[curr.type].push(curr.value);
        return acc;
      }, {});
      const geographyFilter = Object.keys(selectedGeographyByType).map((column_name) => {
        return {
          display_name: column_name,
          column_name,
          values: selectedGeographyByType[column_name],
          zoomToFilterBounds: true,
        };
      });

      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters']`, geographyFilter);
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['filterMode']`, "all");
      });
    };

    if (geography?.length > 0) {
      //get zoom bounds
      getFilterBounds();
      //filter and display borders for selected geographie
      const selectedCounty = geography.filter((geo) => geo.type === "county_name");
      if (selectedCounty.length > 0 && countyLayerId) {
        //cenrep source 1514 view 1989 test NYS_County_Boundaries
        setGeometryBorderFilter({
          setState,
          layerId: countyLayerId,
          geomDataKey: "ny_counti_4",
          values: selectedCounty.map((county) => {
            const lowCountyString = county.value.toLowerCase();
            return lowCountyString[0].toUpperCase() + lowCountyString.slice(1);
          }),
          layerBasePath: symbologyLayerPath,
        });
      } else {
        if (countyLayerId) {
          console.log("reserting filter for county::", countyLayerId);
          resetGeometryBorderFilter({
            layerId: countyLayerId,
            setState,
            layerBasePath: symbologyLayerPath,
          });
        }
      }
    } else {
      //resets dynamic filter if there are no geographies selected
      setState((draft) => {
        const zoomToFilterBounds = get(draft, `${symbPath}.zoomToFilterBounds`);
        if (zoomToFilterBounds?.length > 0) {
          set(draft, `${symbPath}.zoomToFilterBounds`, []);

          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters']`, []);
        }

        if (pointLayerId) {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['filterMode']`, null);
        }
        if (countyLayerId) {
          resetGeometryBorderFilter({
            layerId: countyLayerId,
            setState,
            layerBasePath: symbologyLayerPath,
          });
        }
      });
    }
  }, [geography]);

  useEffect(() => {
    const getColors = async () => {
      const numbins = 7,
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

      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['layers'][0]['paint']`, { "circle-color": paint }); //Mapbox paint
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['legend-data']`, legend); //AVAIL-written legend component
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['legend-orientation']`, "horizontal");
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['category-show-other']`, "#fff");
      });
    };

    if (pointLayerId) {
      getColors();
    }
  }, [pointLayerId]);


  useEffect(() => {
    console.log({ floodZone });
    let floodValue = floodZone;
    //all points affected by 500 year flood are also affected by 100 year flood
    if(floodZone === '500') {
      floodValue = ['100', '500']
    }
    const newFilter = {
      flood_zone: {
        operator: "==",
        value: floodValue,
        columnName: "flood_zone",
      },
    };
    setState((draft) => {
      set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, newFilter);
    });
    //just need to change `filter` to reflect new value
  }, [floodZone]);

  return [
    {
      label: "Geography",
      controls: [
        {
          type: "multiselect",
          params: {
            options: [BLANK_OPTION, ...geomControlOptions],
            default: "",
            searchable: true,
          },
          path: `['geography']`,
        },
      ],
    },
    {
      label: "Flood Zone",
      controls: [
        {
          type: "select",
          params: {
            options: [{ value: "100", name: "100" },{ value: "500", name: "500" }],
          },
          path: `['${FLOOD_ZONE_KEY}']`,
        },
      ],
    }
  ];
};

export { externalPanel };
