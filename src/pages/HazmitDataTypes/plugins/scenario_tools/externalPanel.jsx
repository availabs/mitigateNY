import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store";
import { CMSContext } from "~/modules/dms/packages/dms/src";
import get from "lodash/get";
import set from "lodash/set";
import { Button } from "~/modules/avl-components/src";
import {
  PLUGIN_ID,
  POINT_LAYER_KEY,
  COUNTY_LAYER_KEY,
  TOWN_LAYER_KEY,
  FLOODPLAIN_LAYER_KEY,
  GEOGRAPHY_KEY,
  FLOOD_ZONE_KEY,
  TOWNS_KEY,
  BLANK_OPTION,
  COUNTY_LAYER_NAME_COLUMN,
  BLD_AV_COLUMN,
  COUNTY_COLUMN,
  TOWN_NAME_COLUMN,
  FLOOD_ZONE_COLUMN,
  FLOODPLAIN_ZONE_COLUMN,
  FLOODPLAIN_2ND_ZONE_COLUMN,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
  POLYGON_LAYER_KEY,
  YEAR_100_FLOOD_VAL,
  YEAR_500_FLD_ZONE_VAL,
  YEAR_500_FLOOD_VAL,
  YEAR_500_2ND_FLOOD_VAL,
  FLOODPLAIN_COUNTY_COLUMN,
  TOWN_COUNTY_COLUMN,
} from "./constants";
import { countyNameToFips } from "./countyNameToFips";
import {
  setInitialGeomStyle,
  setPointLayerStyle,
  setPolygonLayerStyle,
  resetGeometryBorderFilter,
  setGeometryBorderFilter,
  onlyUnique,
} from "./utils";

import { choroplethPaint } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { extractState, createFalcorFilterOptions } from "~/pages/DataManager/MapEditor/stateUtils";

const externalPanel = ({ state, setState, pathBase = "" }) => {
  const dctx = useContext(DamaContext);
  const cctx = useContext(CMSContext);
  const ctx = dctx?.falcor ? dctx : cctx;

  const [rawCountyGeoms, setRawCountyGeoms] = useState();
  const [rawTownGeoms, setRawTownGeoms] = useState();

  let { falcor, pgEnv, baseUrl } = ctx;

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

  const {
    viewId,
    pointLayerId,
    countyLayerId,
    geography,
    floodZone,
    polygonLayerId,
    towns,
    townLayerViewId,
    townLayerId,
    floodplainLayerId,
  } = useMemo(() => {
    const pointLayerId = get(state, `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`);
    const townLayerId = get(state, `${pluginDataPath}['active-layers'][${TOWN_LAYER_KEY}]`);
    return {
      viewId: get(state, `${symbologyLayerPath}['${pointLayerId}']['view_id']`, null),
      pointLayerId,
      geography: get(state, `${pluginDataPath}['${GEOGRAPHY_KEY}']`, null),
      countyLayerId: get(state, `${pluginDataPath}['active-layers'][${COUNTY_LAYER_KEY}]`),
      polygonLayerId: get(state, `${pluginDataPath}['active-layers'][${POLYGON_LAYER_KEY}]`),
      townLayerId,
      townLayerViewId: get(state, `${symbologyLayerPath}['${townLayerId}']['view_id']`, null),
      floodZone: get(state, `${pluginDataPath}['${FLOOD_ZONE_KEY}']`),
      towns: get(state, `${pluginDataPath}['${TOWNS_KEY}']`),
      floodplainLayerId: get(state, `${pluginDataPath}['active-layers'][${FLOODPLAIN_LAYER_KEY}]`),
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

  const { symbology_id, pageFilters } = useMemo(() => {
    if (dctx) {
      return extractState(state);
    } else {
      const symbName = Object.keys(state.symbologies)[0];
      const symbPathBase = `symbologies['${symbName}']`;
      const symbData = get(state, symbPathBase, {});
      const pageFilters = symbData.symbology.pageFilters;
      return { ...extractState(symbData), pageFilters };
    }
  }, [state]);

  const geomOptions = JSON.stringify({
    groupBy: [COUNTY_COLUMN],
  });
  useEffect(() => {
    const getGeoms = async () => {
      await falcor.get(["dama", pgEnv, "viewsbyId", viewId, "options", geomOptions, "databyIndex", { from: 0, to: 200 }, [COUNTY_COLUMN]]).then(res => {
        const geomData = get(res, ["json", "dama", pgEnv, "viewsbyId", viewId, "options", geomOptions, "databyIndex"]);
        setRawCountyGeoms(geomData);
      });
    };

    if (viewId) {
      getGeoms();
    }
  }, [viewId]);

  const geomControlOptions = useMemo(() => {
    const geomData = rawCountyGeoms;
    if (geomData) {
      const geoms = {
        [COUNTY_COLUMN]: [],
      };

      Object.values(geomData).forEach((da) => {
        geoms[COUNTY_COLUMN].push(da[COUNTY_COLUMN]);
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
      geoms[COUNTY_COLUMN] = geoms[COUNTY_COLUMN].filter(onlyUnique)
        .filter(objectFilter)
        .filter(truthyFilter)
        .map((da) => {
          return {
            name: da + " County",
            value: da,
            type: COUNTY_COLUMN,
          };
        })
        .sort(nameSort);

      return [...geoms[COUNTY_COLUMN]];
    } else {
      return [];
    }
  }, [rawCountyGeoms]);

  const townGeomOptions = JSON.stringify({
    groupBy: [TOWN_NAME_COLUMN, TOWN_COUNTY_COLUMN],
  });
  useEffect(() => {
    const getGeoms = async () => {
      await falcor.get([
        "dama",
        pgEnv,
        "viewsbyId",
        townLayerViewId,
        "options",
        townGeomOptions,
        "databyIndex",
        { from: 0, to: 200 },
        [TOWN_NAME_COLUMN, TOWN_COUNTY_COLUMN],
      ]).then(res => {
        const geomData = get(res, ["json","dama", pgEnv, "viewsbyId", townLayerViewId, "options", townGeomOptions, "databyIndex"]);
        setRawTownGeoms(geomData);
      });
    };

    if (townLayerViewId) {
      getGeoms();
    }
  }, [townLayerViewId]);

  const townControlOptions = useMemo(() => {
    const geomData = rawTownGeoms;
    if (geomData) {
      const geoms = {
        [TOWN_NAME_COLUMN]: [],
      };

      Object.values(geomData)
        .filter((da) => {
          if (geography && geography.length > 0) {
            return geography[0].value === da.county;
          } else {
            return true;
          }
        })
        .forEach((da) => {
          geoms[TOWN_NAME_COLUMN].push(da[TOWN_NAME_COLUMN]);
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
      geoms[TOWN_NAME_COLUMN] = geoms[TOWN_NAME_COLUMN].filter(onlyUnique)
        .filter(objectFilter)
        .filter(truthyFilter)
        .map((da) => ({
          name: da.toLowerCase(),
          value: da,
          type: "town",
        }))
        .sort(nameSort);

      return [...geoms[TOWN_NAME_COLUMN]];
    } else {
      return [];
    }
  }, [rawTownGeoms, geography]);

  useEffect(() => {
    if (pageFilters && pageFilters.length > 0) {
      const countyPageFilter = pageFilters.find((pf) => pf.searchKey === COUNTY_COLUMN);

      if (countyPageFilter && countyPageFilter?.values?.length > 0) {
        setGeometryBorderFilter({
          setState,
          layerId: countyLayerId,
          geomDataKey: COUNTY_LAYER_NAME_COLUMN,
          values: [countyPageFilter.values[0]],
          layerBasePath: symbologyLayerPath,
        });

        setState((draft) => {
          set(draft, `${pluginDataPath}['${GEOGRAPHY_KEY}']`, [
            {
              name: countyPageFilter.values[0] + " County",
              value: countyPageFilter.values[0],
              type: COUNTY_COLUMN,
            },
          ]);
        });
      }
    }
  }, [pageFilters]);
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
      const pointAndPolyGeoFilter = Object.keys(selectedGeographyByType).map((column_name) => {
        return {
          display_name: column_name,
          column_name,
          values: selectedGeographyByType[column_name],
          zoomToFilterBounds: false,
        };
      });
      setState((draft) => {
        if (pointLayerId) {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters']`, pointAndPolyGeoFilter);
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['filterMode']`, "all");
        }
        if (polygonLayerId) {
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters']`, pointAndPolyGeoFilter);
        }
        if (countyLayerId) {
          const geographyFilter = Object.keys(selectedGeographyByType).map((column_name) => {
            return {
              display_name: column_name,
              column_name: COUNTY_LAYER_NAME_COLUMN,
              values: selectedGeographyByType[column_name],
              zoomToFilterBounds: true,
            };
          });
          set(draft, `${symbologyLayerPath}['${countyLayerId}']['dynamic-filters']`, geographyFilter);
          set(draft, `${symbologyLayerPath}['${countyLayerId}']['filterMode']`, "all");
        }
        if (floodplainLayerId) {
          const selectedCounty = geography.filter((geo) => geo.type === COUNTY_COLUMN);

          const countyName = selectedCounty[0].value;
          const floodplainFips = countyNameToFips[countyName] + "C";
          const floodplainOpacityStyle = ["case", ["==", ["get", FLOODPLAIN_COUNTY_COLUMN], floodplainFips], 0.4, 0];
          set(draft, `${symbologyLayerPath}['${floodplainLayerId}'].layers[1].paint['fill-opacity']`, floodplainOpacityStyle);
        }
      });
    };

    if (geography?.length > 0) {
      //get zoom bounds
      //IT ALSO sets the data filters for polygons, points, and counties
      getFilterBounds();
      //filter and display borders for selected geographie
      const selectedCounty = geography.filter((geo) => geo.type === COUNTY_COLUMN);
      if (selectedCounty.length > 0 && countyLayerId) {
        //cenrep source 1514 view 1989 test NYS_County_Boundaries
        setGeometryBorderFilter({
          setState,
          layerId: countyLayerId,
          geomDataKey: COUNTY_LAYER_NAME_COLUMN,
          values: selectedCounty.map((county) => county.value),
          layerBasePath: symbologyLayerPath,
        });
      }
    } else {
      //resets dynamic filter if there are no geographies selected
      setState((draft) => {
        const zoomToFilterBounds = get(draft, `${symbPath}.zoomToFilterBounds`);
        if (zoomToFilterBounds?.length > 0) {
          set(draft, `${symbPath}.zoomToFilterBounds`, []);
        }
        if (pointLayerId) {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters']`, []);
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['filterMode']`, null);
        }
        if (polygonLayerId) {
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters']`, []);
          set(draft, `${symbologyLayerPath}['${polygonLayerId}']['filterMode']`, null);
        }
        if (countyLayerId) {
          //set(draft, `${symbologyLayerPath}['${countyLayerId}']['dynamic-filters']`, []);
          resetGeometryBorderFilter({
            layerId: countyLayerId,
            geomDataKey: COUNTY_LAYER_NAME_COLUMN,
            setState,
            layerBasePath: symbologyLayerPath,
          });
        }
        if (floodplainLayerId) {
          set(draft, `${symbologyLayerPath}['${floodplainLayerId}'].layers[1].paint['fill-opacity']`, 0.35);
        }
      });
    }
  }, [geography]);
  useEffect(() => {
    if (towns?.length > 0) {
      if (townLayerId) {
        //cenrep source 516 view cities and towns
        setGeometryBorderFilter({
          setState,
          layerId: townLayerId,
          geomDataKey: TOWN_NAME_COLUMN,
          values: towns.map((town) => town.value),
          layerBasePath: symbologyLayerPath,
        });

        const townFilter = [
          {
            display_name: TOWN_NAME_COLUMN,
            column_name: TOWN_NAME_COLUMN,
            values: towns.map((town) => town.value),
            zoomToFilterBounds: false,
          },
        ];
        setState((draft) => {
          set(draft, `${symbologyLayerPath}['${townLayerId}']['dynamic-filters']`, townFilter);
        });
        // const geographyFilter = {
        //   columnName: geomDataKey,
        //   value: values,
        //   operator: "==",
        // };
        // setState((draft) => {
        //   set(draft, `${symbologyLayerPath}['${townLayerId}']['filter']['${TOWN_NAME_COLUMN}']`, geographyFilter);
        // })
      }
    } else {
      if (townLayerId) {
        resetGeometryBorderFilter({
          layerId: townLayerId,
          geomDataKey: TOWN_NAME_COLUMN,
          setState,
          layerBasePath: symbologyLayerPath,
        });
      }
    }
  }, [towns, geography]);

  /**
   * TODO
   * MAYBE move the style useEffects to `internalPanel`
   * We apply them when the layer changes, and that can only happen via internal controls
   */
  useEffect(() => {
    if (pointLayerId) {
      setPointLayerStyle({ setState, layerId: pointLayerId, layerBasePath: symbologyLayerPath });
    }
  }, [pointLayerId]);
  useEffect(() => {
    if (polygonLayerId) {
      setPolygonLayerStyle({ setState, layerId: polygonLayerId, layerBasePath: symbologyLayerPath, floodZone });
    }
  }, [polygonLayerId, floodZone]);

  useEffect(() => {
    let floodValue = floodZone;
    let floodplainFilter = {};
    //all points affected by 500 year flood are also affected by 100 year flood
    if (floodZone === "500") {
      floodValue = ["100", "500"];
      floodplainFilter = {
        [FLOODPLAIN_ZONE_COLUMN]: {
          operator: "!=",
          value: YEAR_500_FLD_ZONE_VAL,
          columnName: FLOODPLAIN_ZONE_COLUMN,
        },
        [FLOODPLAIN_2ND_ZONE_COLUMN]: {
          operator: "==",
          value: YEAR_500_2ND_FLOOD_VAL,
          columnName: FLOODPLAIN_2ND_ZONE_COLUMN,
        },
      };
    } else {
      floodValue = ["100"];
      floodplainFilter = {
        [FLOODPLAIN_ZONE_COLUMN]: {
          operator: "==",
          value: YEAR_100_FLOOD_VAL,
          columnName: FLOODPLAIN_ZONE_COLUMN,
        },
      };
    }

    //if fld_zone = [A,AE,AH,AO], then it is 100
    //if fld_zone = [X], AND zone_subty = [0.2 PCT ANNUAL CHANCE FLOOD HAZARD], then it is 500
    setState((draft) => {
      if (polygonLayerId) {
        set(draft, `${symbologyLayerPath}['${polygonLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
      }
      if (pointLayerId) {
        const newPointFilter = {
          flood_zone: {
            operator: "==",
            value: floodValue,
            columnName: "flood_zone",
          },
        };
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, newPointFilter);
      }
      if (countyLayerId) {
        //don't want the map zooming around whenever the user changes the displayed flood zone
        set(draft, `${symbologyLayerPath}['${countyLayerId}']['dynamic-filters'][0]['zoomToFilterBounds']`, false);
      }
      if (floodplainLayerId) {
        set(draft, `${symbologyLayerPath}['${floodplainLayerId}']['filter']`, floodplainFilter);
        set(draft, `${symbologyLayerPath}['${floodplainLayerId}']['filterMode']`, "any");
      }
    });
    //just need to change `filter` to reflect new value
    //todo -- might not need to listen for layerId changes here. since they can only change internally
    //but, otherwise, I need to set defaults in `internalPanel` too, and double code = bad
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
          path: `['${GEOGRAPHY_KEY}']`,
        },
      ],
    },
    {
      label: "Flood Zone",
      controls: [
        {
          type: "select",
          params: {
            options: [
              { value: "100", name: "100" },
              { value: "500", name: "500" },
            ],
          },
          path: `['${FLOOD_ZONE_KEY}']`,
        },
      ],
    },
    {
      label: "Towns",
      controls: [
        {
          type: "multiselect",
          params: {
            options: [BLANK_OPTION, ...townControlOptions],
            default: "",
            searchable: true,
          },
          path: `['${TOWNS_KEY}']`,
        },
      ],
    },
  ];
};

export { externalPanel };
