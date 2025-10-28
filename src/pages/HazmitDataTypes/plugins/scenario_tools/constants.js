import get from "lodash/get";
const PLUGIN_ID = "scenarioTools";

const BLD_AV_COLUMN = "building_av";
const FLOOD_ZONE_COLUMN = "flood_zone";
const COUNTY_COLUMN = "county_name";
const TOWN_NAME_COLUMN = "name";
const COUNTY_LAYER_NAME_COLUMN = "ny_counti_4";
const BILD_MUNI_COLUMN = "muni_name";
const FLOODPLAIN_ZONE_COLUMN = "fld_zone";
const FLOODPLAIN_2ND_ZONE_COLUMN = "zone_subty";
const FLOODPLAIN_COUNTY_COLUMN = 'dfirm_id';


const YEAR_100_FLOOD_VAL = ["A", "AE", "AH", "AO"];
const YEAR_500_FLD_ZONE_VAL = ['OPEN WATER', 'VE', 'X'];
const YEAR_500_FLOOD_VAL = ["X"];
const YEAR_500_2ND_FLOOD_VAL = ["0.2 PCT ANNUAL CHANCE FLOOD HAZARD"];

//

const GEOGRAPHY_KEY = "geography";
const POINT_LAYER_KEY = "point-layer";
const COUNTY_LAYER_KEY = "county";
const POLYGON_LAYER_KEY = "polygon-layer";
const TOWN_LAYER_KEY = "town-layer";
const FLOODPLAIN_LAYER_KEY = "floodplain-layer";
const FLOOD_ZONE_KEY = "flood-zone";
const TOWNS_KEY = "towns";

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
  TOWN_LAYER_KEY,
  FLOODPLAIN_LAYER_KEY,
  GEOGRAPHY_KEY,
  FLOOD_ZONE_COLUMN,
  TOWN_NAME_COLUMN,
  COUNTY_LAYER_NAME_COLUMN,
  BILD_MUNI_COLUMN,
  COUNTY_COLUMN,
  BLANK_OPTION,
  BLD_AV_COLUMN,
  FLOODPLAIN_ZONE_COLUMN,
  FLOODPLAIN_2ND_ZONE_COLUMN,
  FLOODPLAIN_COUNTY_COLUMN,
  FLOOD_ZONE_KEY,
  TOWNS_KEY,
  getColorRange,
  defaultFilter,
  COLOR_SCALE_MAX,
  COLOR_SCALE_BREAKS,
  YEAR_100_FLOOD_VAL,
  YEAR_500_FLD_ZONE_VAL,
  YEAR_500_FLOOD_VAL,
  YEAR_500_2ND_FLOOD_VAL,
};
