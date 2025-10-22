import get from "lodash/get";
const PLUGIN_ID = "scenarioTools";



const BLD_AV_COLUMN = "building_av";
const FLOOD_ZONE_COLUMN = "flood_zone";
const COUNTY_COLUMN = "county_name";


const GEOGRAPHY_KEY = 'geography'
const POINT_LAYER_KEY = "point-layer";
const COUNTY_LAYER_KEY = "county";
const POLYGON_LAYER_KEY = "polygon-layer";
const FLOOD_ZONE_KEY = "flood-zone";

const BLANK_OPTION = { value: "", name: "" };

import colorbrewer from "colorbrewer";
const ColorRanges = {};
for (const type in colorbrewer.schemeGroups) {
  colorbrewer.schemeGroups[type].forEach((name) => {
    const group = colorbrewer[name];
    for (const length in group) {
      if (!(length in ColorRanges)) {
        ColorRanges[length] = [];
      }
      ColorRanges[length].push({
        type: `${type[0].toUpperCase()}${type.slice(1)}`,
        name,
        category: "Colorbrewer",
        colors: group[length],
      });
    }
  });
}

const getColorRange = (size, name) =>
  get(ColorRanges, [size], [])
    .reduce((a, c) => (c.name === name ? c.colors : a), [])
    .slice();

const defaultFilter = {
  // county_name: {
  //   operator: "==",
  //   value: ["Albany"],
  //   columnName: "county_name",
  // },
  flood_zone: {
    operator: "==",
    value: ["100", "500"],
    columnName: "flood_zone",
  },
};

const COLOR_SCALE_MAX = 1000000;
const COLOR_SCALE_BREAKS = [0, 200000, 400000, 600000, 800000, COLOR_SCALE_MAX];

export {
  PLUGIN_ID,
  POINT_LAYER_KEY,
  COUNTY_LAYER_KEY,
  POLYGON_LAYER_KEY,
  GEOGRAPHY_KEY,
  FLOOD_ZONE_COLUMN,
  COUNTY_COLUMN,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  FLOOD_ZONE_KEY,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
};
