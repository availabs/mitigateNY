import { get, set } from "lodash-es";
import { BLD_AV_COLUMN, COLOR_SCALE_MAX, COLOR_SCALE_BREAKS, getColorRange } from "./constants";
import { choroplethPaint, fnumIndex } from "~/pages/DataManager/MapEditor/components/LayerEditor/datamaps";
import { cloneDeep } from "lodash-es";
const setInitialGeomStyle = ({ setState, layerId, layerBasePath }) => {
  setState((draft) => {
    const draftLayers = get(draft, `${layerBasePath}['${layerId}'].layers`);
    const borderLayer = draftLayers.find((mapLayer) => mapLayer.type === "line");
    if (borderLayer) {
      borderLayer.paint = { "line-color": "#fff", "line-width": 1 };
    }
    const fillLayer = draftLayers.find((mapLayer) => mapLayer.type === "fill");
    if (fillLayer) {
      fillLayer.paint = { "fill-opacity": 0, "fill-color": "#fff" };
    }
    draftLayers.forEach((d, i) => {
      d.layout = { visibility: "visible" };
    });
    set(draft, `${layerBasePath}['${layerId}']['legend-orientation']`, "none");
    set(draft, `${layerBasePath}['${layerId}']['isVisible']`, true);
  });
};

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

const setPolygonLayerStyle = ({ setState, layerId, layerBasePath, floodZone }) => {
  //when flood zone === 500, all buildings with flood zone of 500 or 100 get colored
  //when flood zone === 100, only builindgs with zone of 100 get colored
  let { paint: noColorPaint } = choroplethPaint(
    BLD_AV_COLUMN,
    COLOR_SCALE_MAX,
    ["#000", "#000", "#000", "#000", "#000", "#000", "#000", "#000"],
    numbins,
    method,
    COLOR_SCALE_BREAKS,
    showOther,
    "horizontal"
  );
  let casePaint;
  if (floodZone === "500") {
    casePaint = ["case", 
      ["==", ["get", "flood_zone"], "100"], paint, 
      ["==", ["get", "flood_zone"], "500"], paint, 
      noColorPaint
    ];
  } else if (floodZone === "100") {
    casePaint = ["case", 
      ["==", ["get", "flood_zone"], "100"], paint, 
      noColorPaint
    ];
  }

  setState((draft) => {
    const draftLayers = get(draft, `${layerBasePath}['${layerId}'].layers`);
    const borderLayer = draftLayers.find((mapLayer) => mapLayer.type === "line");
    if (borderLayer) {
      borderLayer.paint = { "line-color": "#000", "line-width": 1 };
    }
    const fillLayer = draftLayers.find((mapLayer) => mapLayer.type === "fill");
    if (fillLayer) {
      fillLayer.paint = { "fill-opacity": 0.5, "fill-color": casePaint };
    }

    draftLayers.forEach((d, i) => {
      d.layout = { visibility: "visible" };
      d.minzoom = 12;
    });

    set(draft, `${layerBasePath}['${layerId}']['category-show-other']`, "#fff");
    set(draft, `${layerBasePath}['${layerId}']['legend-orientation']`, "none");
  });
};

const setPointLayerStyle = ({ setState, layerId, layerBasePath }) => {
  const circleLowerBound = 1;
  const circleUpperBound = COLOR_SCALE_MAX;
  const circleRadius = [
    "interpolate",
    ["linear", 1],
    ["to-number", ["get", BLD_AV_COLUMN]],
    circleLowerBound, //min of dataset
    4, //min radius (px) of circle
    circleUpperBound, //max of dataset
    12, //max radius (px) of circle
  ];
  setState((draft) => {
    set(draft, `${layerBasePath}['${layerId}']['layers'][0]['paint']`, {
      "circle-color": paint,
      "circle-radius": circleRadius,
      "circle-opacity": 0.5,
    }); //Mapbox
    const newLegend = COLOR_SCALE_BREAKS.map(scaleVal => fnumIndex(scaleVal, 0, true))
    const formattedLegend = cloneDeep(legend).map((lRow, i) => ({...lRow, label:newLegend[i]}))
    set(draft, `${layerBasePath}['${layerId}']['legend-data']`, formattedLegend); //AVAIL-written legend component
    set(draft, `${layerBasePath}['${layerId}']['legend-orientation']`, "horizontal");
    set(draft, `${layerBasePath}['${layerId}']['category-show-other']`, "#fff");
  });
};

const setGeometryBorderFilter = ({ setState, layerId, geomDataKey, values, layerBasePath }) => {
  setState((draft) => {
    set(draft, `${layerBasePath}['${layerId}']['isVisible']`, true);

    const draftLayers = get(draft, `${layerBasePath}['${layerId}'].layers`);
    draftLayers.forEach((d, i) => {
      d.layout = { visibility: "visible" };
    });
    const borderLayer = draftLayers.find((mapLayer) => mapLayer.type === "line");
    if (borderLayer) {
      borderLayer.paint = {...borderLayer.paint, "line-opacity": 1 };
    }
    // console.log(JSON.parse(JSON.stringify({draftLayers})))
    // const geographyFilter = {
    //   columnName: geomDataKey,
    //   value: values,
    //   operator: "==",
    // };
    // console.log({geographyFilter})
    //set(draft, `${layerBasePath}['${layerId}']['filter']['${geomDataKey}']`, geographyFilter);
  });
};

const resetGeometryBorderFilter = ({ setState, layerId, layerBasePath, geomDataKey }) => {
  setState((draft) => {
    set(draft, `${layerBasePath}['${layerId}']['isVisible']`, false);

    const draftLayers = get(draft, `${layerBasePath}['${layerId}'].layers`);
    draftLayers?.forEach((d, i) => {
      d.layout = { visibility: "none" };
    });
    set(draft, `${layerBasePath}['${layerId}']['filter']`, undefined);
    set(draft, `${layerBasePath}['${layerId}']['dynamic-filters']`, []);
  });
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export { setPointLayerStyle, setPolygonLayerStyle, setInitialGeomStyle, onlyUnique, resetGeometryBorderFilter, setGeometryBorderFilter };
