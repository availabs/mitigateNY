import { useState, useEffect, useMemo, createContext, useRef, useContext } from "react";
import { DamaContext } from "~/pages/DataManager/store"
import { CMSContext } from "~/modules/dms/src";
import get from "lodash/get";
import set from "lodash/set";
import { Button } from "~/modules/avl-components/src";
import {
  POINT_LAYER_KEY,
  BLANK_OPTION, 
  getColorRange, 
  defaultFilter
} from "./constants";
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

    if(pointLayerId) {
      //TODO eventually need to filter via page param, not just default
      setState((draft) => {
        set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, defaultFilter);
      });
    }

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
    } = useMemo(() => {
      const pluginDataPath = `symbology.pluginData.${PLUGIN_ID}`;
      return {
        pluginDataPath,
        pointLayerId: get(
          state,
          `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`
        )
      };
    }, [state]);
    console.log("state.symbology",state.symbology.layers)
    console.log({pointLayerId})
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
                // .filter(
                //   (layerKey) =>
                //     layerKey === pointLayerId
                // )
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
    ];

    return controls;
  },
  externalPanel: ({ state, setState, pathBase = "" }) => {
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
    const pluginDataPath =`${pathBase}`;

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
    } = useMemo(() => {
      return {
        viewId: get(state, `${pluginDataPath}['viewId']`, null),
        pointLayerId: get(
          state,
          `${pluginDataPath}['active-layers'][${POINT_LAYER_KEY}]`
        ),
      };
    }, [pluginData, pluginDataPath]);

    //TODO eventually need to filter via page param, not just default
    useEffect(() => {
      if(pointLayerId) {
        setState((draft) => {
          set(draft, `${symbologyLayerPath}['${pointLayerId}']['filter']`, defaultFilter);
        });
      }
    }, [pointLayerId])
    
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
    
    console.log({dataFilter})
    const falcorDataFilter = useMemo(() => {
      return createFalcorFilterOptions({
        dynamicFilter: existingDynamicFilter,
        filterMode,
        dataFilter,
      });
    }, [existingDynamicFilter, filterMode, dataFilter]);
    console.log({falcorDataFilter})
    useEffect(() => {
      const getColors = async () => {
        const numbins = 7,
          method = "ckmeans";
        const domainOptions = {
          column: 'building_av',
          viewId: parseInt(viewId),
          numbins,
          method,
          dataFilter: falcorDataFilter,
        };

        const showOther = "#ccc";
        const res = await falcor.get([
          "dama",
          pgEnv,
          "symbologies",
          "byId",
          [symbology_id],
          "colorDomain",
          "options",
          JSON.stringify(domainOptions),
        ]);
        const colorBreaks = get(res, [
          "json",
          "dama",
          pgEnv,
          "symbologies",
          "byId",
          [symbology_id],
          "colorDomain",
          "options",
          JSON.stringify(domainOptions),
        ]);
        //console.log({newDataColumn, max:colorBreaks['max'], colorange: getColorRange(7, "RdYlBu").reverse(), numbins, method, breaks:colorBreaks['breaks'], showOther, orientation:'vertical'})

        //format is used to format legend labels
        const { range: paintRange, format } = updateLegend(measureFilters);
        let { paint, legend } = choroplethPaint(
          newDataColumn,
          colorBreaks["max"],
          getColorRange(8, "YlGn"),
          numbins,
          method,
          colorBreaks["breaks"],
          showOther,
          "vertical"
        );

        // const legendFormat = d3format(format);
        // legend = legend.map((legendBreak) => {
        //   const shouldFormat =
        //     !newDataColumn.toLowerCase().includes("phed") &&
        //     !newDataColumn.toLowerCase().includes("ted");
        //   return {
        //     ...legendBreak,
        //     label: shouldFormat
        //       ? legendFormat(legendBreak.label.split("- ")[1])
        //       : legendBreak.label.split("- ")[1],
        //   };
        // });

        setState((draft) => {
          set(
            draft,
            `${symbologyLayerPath}['${pointLayerId}']['layers'][0]['paint']`,
            { ...npmrdsPaint, "circle-color": paint }
          ); //Mapbox paint
          set(
            draft,
            `${symbologyLayerPath}['${pointLayerId}']['legend-data']`,
            legend
          ); //AVAIL-written legend component
          set(
            draft,
            `${symbologyLayerPath}['${pointLayerId}']['legend-orientation']`,
            "horizontal"
          );
          set(
            draft,
            `${symbologyLayerPath}['${pointLayerId}']['category-show-other']`,
            "#fff"
          );
          // if (mpoLayerId) {
          //   set(
          //     draft,
          //     `${symbologyLayerPath}['${mpoLayerId}']['legend-orientation']`,
          //     "none"
          //   );
          // }
          // if (countyLayerId) {
          //   set(
          //     draft,
          //     `${symbologyLayerPath}['${countyLayerId}']['legend-orientation']`,
          //     "none"
          //   );
          // }
          // if (regionLayerId) {
          //   set(
          //     draft,
          //     `${symbologyLayerPath}['${regionLayerId}']['legend-orientation']`,
          //     "none"
          //   );
          // }
          // if (uaLayerId) {
          //   set(
          //     draft,
          //     `${symbologyLayerPath}['${uaLayerId}']['legend-orientation']`,
          //     "none"
          //   );
          // }
          //TODO add `no legend` for region, UA layers
        });
      };

      if (pointLayerId && viewId) {
        console.log("get those colors!")
        getColors();
      }
    }, [pointLayerId, falcorDataFilter, viewId]);

    return [];
  },
  comp: ({ state, setState }) => {
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
    const { points } = useMemo(() => {
      return {
        points: get(state, `${pluginDataPath}['points']`, []),
      };
    }, [state]);

    return (
      <div
        className="flex flex-col pointer-events-auto drop-shadow-lg p-4 bg-white/75 items-center"
        style={{
          position: "absolute",
          bottom: "94px",
          left: "90px",
          color: "black",
          width: "318px",
          maxHeight: "325px",
        }}
      >
        <div className="text-lg">Selected Points:</div>
        <div>
          {points.map((point) => (
            <div className="text-sm">
              {precisionRound(point.lng, 4)}, {precisionRound(point.lat, 4)}
            </div>
          ))}
        </div>
        <Button
          disabled={points.length < 2}
          themeOptions={{ color: "transparent" }}
          //className='bg-white hover:bg-cool-gray-700 font-sans text-sm text-npmrds-100 font-medium'
          onClick={(e) => {
            console.log("sending points to API!");
            console.log({ points });
            resetPointsAndMarkers({ setState, pluginDataPath });
          }}
          style={{ width: "75%", marginTop: "10px" }}
        >
          Send to Routing API
        </Button>
      </div>
    );
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
