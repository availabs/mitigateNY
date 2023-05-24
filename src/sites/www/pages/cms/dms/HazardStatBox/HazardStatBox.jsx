import React, { useState } from "react";
import get from "lodash/get";
import { getColorRange  } from "~/modules/avl-components/src";
import { useFalcor } from "~/modules/avl-falcor"
// import { useSelector } from "react-redux";
// import { selectPgEnv } from "../../DataManager/store";
import { RenderSvgBar } from "./svgBar";
import {
  hazardsMeta,
  ctypeColors
} from "~/utils/colors";
import { fnumIndex } from "~/utils/macros";
import {pgEnv} from "~/utils"

import { scaleQuantize } from "d3-scale";

const palattes = [
  ["#f5b899", "#f8b46f", "#fdd0a2", "#fdae6b",
    "#fd8d3c", "#f16913", "#d94801", "#a63603",
    "#7f2704"],
  ["#f5b899", "#f8b46f", "#ffa342", "#ff8218",
    "#e76100", "#c94e00", "#be4000", "#9d3400",
    "#792606"],
  ["#ffb950", "#FFAD33", "#FF931F", "#FF7E33",
    "#FA5E1F", "#B81702", "#A50104", "#8E0103",
    "#7A0103"],
  ["#FFB600", "#FFAA00", "#FF9E00", "#FF9100",
    "#FF8500", "#FF7900", "#FF6D00", "#FF6000",
    "#FF4800"]
];

const colors = scaleQuantize().domain([0, 101]).range(palattes[2]);

// const freqToText = (f) => f >= 1 ? `${f} events/yr` : f > 0 ? `1 event/${(1/f).toFixed(2)} yrs` : ``;
const freqToText = (f) => <span className={"pl-1"}>{f}<span className={"font-xs pl-1"}>events/yr</span></span>;
export const HazardStatBox = ({ geoid, hazard, eal_source_id, eal_view_id, size = "large", isTotal = false }) => {
  const { falcor, falcorCache } = useFalcor();
  const [nriIds, setNriIds] = useState({ source_id: null, view_id: null });
  const [fusionIds, setfusionIds] = useState({ source_id: null, view_id: null });
  
  const freqCol = `sum(${get(hazardsMeta, [hazard, "prefix"], "total")}_afreq) as freq`,
    expCol = `sum(${get(hazardsMeta, [hazard, "prefix"], "total")}_expt) as exp`;
  const npCol = isTotal ? "national_percent_total" : "national_percent_hazard",
    spCol = isTotal ? "state_percent_total" : "state_percent_hazard",
    ealCol = isTotal ? "avail_eal_total" : "avail_eal";

  const blockClass = {
    large: "flex flex-col pt-2 text-sm",
    small: "flex flex-row justify-between pt-2 text-xs"
  };
  const blockWrapper = {
    large: `flex flex-col justify-between shrink-0 ml-5 pt-2`,
    small: `flex flex-col`
  };
  const svgBarHeight = { large: 30, small: 12 };
  const svgBarRadius = { large: 20, small: 10 };
  const fontSizeInner = { large: "14.5px", small: "12.5px" };
  const fontSizeOuter = { large: "13.5px", small: "11.5px" };

  let
    fipsCol = `substring(stcofips, 1, ${geoid.length})`,
    nriOptions = JSON.stringify({
      filter: { [fipsCol]: [geoid] },
      groupBy: [fipsCol]
    }),
    nriPath = ({ view_id }) => ["dama", pgEnv, "viewsbyId", view_id, "options", nriOptions];
  let
    actualDamageCol = "sum(fusion_property_damage) + sum(fusion_crop_damage) + sum(swd_population_damage) as actual_damage",
    geoidCOl = `substring(geoid, 1, ${geoid.length})`,
    fusionAttributes = [`${geoidCOl} as geoid`, "nri_category", actualDamageCol],
    fusionAttributesTotal = [`${geoidCOl} as geoid`, actualDamageCol],
    fusionOptions = JSON.stringify({
      aggregatedLen: true,
      filter: isTotal ? { [geoidCOl]: [geoid] } : { [geoidCOl]: [geoid] },
      groupBy: [geoidCOl, "nri_category"]
    }),
    fusionOptionsTotal = JSON.stringify({
      aggregatedLen: true,
      filter: isTotal ? { [geoidCOl]: [geoid] } : { [geoidCOl]: [geoid] },
      groupBy: [geoidCOl]
    }),
    fusionPath = ({ view_id }) => ["dama", pgEnv, "viewsbyId", view_id, "options", fusionOptions],
    fusionPathTotal = ({ view_id }) => ["dama", pgEnv, "viewsbyId", view_id, "options", fusionOptionsTotal];

  React.useEffect(() => {
    falcor.get(
      ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", eal_view_id],
      ["comparative_stats", pgEnv, "byEalIds", "source", eal_source_id, "view", eal_view_id, "byGeoid", geoid]
    ).then(async (res) => {
      const deps = get(res, ["json", "dama", pgEnv, "viewDependencySubgraphs", "byViewId", eal_view_id, "dependencies"]);
      const nriView = deps.find(d => d.type === "nri");
      const fusionView = deps.find(d => d.type === "fusion");

      setNriIds(nriView);
      setfusionIds(fusionView);

      const lenRes = await falcor.get([...fusionPath(fusionView), "length"]);
      const len = get(lenRes, ["json", ...fusionPath(fusionView), "length"], 0);

      const fusionByIndexRoute = [...fusionPath(fusionView), "databyIndex", { from: 0, to: len - 1 }, fusionAttributes];
      const fusionTotalByIndexRoute = [...fusionPathTotal(fusionView), "databyIndex", {
        from: 0,
        to: 0
      }, fusionAttributesTotal];

      const routes = isTotal && len ? [fusionByIndexRoute, fusionTotalByIndexRoute] :
        !isTotal && len ? [[...nriPath(nriView), "databyIndex", {
          from: 0,
          to: len - 1
        }, [freqCol, expCol]], fusionByIndexRoute, fusionTotalByIndexRoute] : [];
      return falcor.get(...routes);
    });
  }, [geoid, hazard, falcorCache]);

  const data = get(falcorCache, ["comparative_stats", pgEnv, "byEalIds", "source", eal_source_id, "view", eal_view_id, "byGeoid", geoid, "value"], [])
    .find(row => row.geoid === geoid && (row.nri_category === hazard || isTotal));

  const nationalPercentile = get(data, npCol, 0) * 100;
  const statePercentile = get(data, spCol, 0) * 100;
  const hazardPercentile = !isTotal && data && (data.avail_eal * 100 / data.avail_eal_total).toFixed(2);
  const hazardPercentileArray = isTotal && data &&
    get(falcorCache, ["comparative_stats", pgEnv, "byEalIds", "source", eal_source_id, "view", eal_view_id, "byGeoid", geoid, "value"], [])
      .filter(row => row.geoid === geoid)
      .map(d => ({
        label: hazardsMeta[d.nri_category].name,
        color: hazardsMeta[d.nri_category].color,
        value: (d.avail_eal * 100 / d.avail_eal_total).toFixed(2)
      }))
      .sort((a, b) => +b.value - +a.value);

  return (
    <div className={`border border-gray-200 p-5 ${get(data, ealCol, 0) ? `bg-white` : `bg-gray-100`}`}>
      <div className={"w-full border-b-2 flex "} style={{ borderColor: get(hazardsMeta, [hazard, "color"], "") }}>
        {
          !isTotal &&
          <div className={"rounded-full mt-1 mr-2 mb-0"}
               style={{
                 height: "12px",
                 width: "12px",
                 backgroundColor: get(hazardsMeta, [hazard, "color"], "")
               }
               } />
        }
        {isTotal ? "Total" : hazardsMeta[hazard].name}
      </div>
      <div className={`w-full ${size === "large" ? `flex flex-row justify-between` : ``}`}>
        <div className={"w-full pr-1"}>
          {
            
            <div className={"w-full pt-1"}>
              <RenderSvgBar
                data={[{
                  label: "Risk",
                  value: (nationalPercentile).toFixed(2),
                  color: colors(nationalPercentile),
                  width: nationalPercentile
                }]}
                height={svgBarHeight[size]}
                radius={svgBarRadius[size]}
                fontSizeInner={fontSizeInner[size]}
                fontSizeOuter={fontSizeOuter[size]}
              />
            </div>
          }
          {
            isTotal &&
            <div className={"w-full pt-4"}>
              {
                <RenderSvgBar
                  data={
                    (hazardPercentileArray || [])
                      .map((h, hI) => (
                        { label: '',
                          value: h.label,
                          showValue: true,
                          valueFloat: 'right',
                          valueCutoff: 10,
                          color: h.color,
                          width: h.value
                        }
                        ))}
                  width={statePercentile}
                  height={svgBarHeight[size]}
                  radius={svgBarRadius[size]}
                  fontSizeInner={fontSizeInner[size]}
                  fontSizeOuter={fontSizeOuter[size]}
                />
              }
            </div>
          }
        </div>
        <div className={blockWrapper[size]}>
          <div className={blockClass[size]}><label className={'break-word w-[25px]'}>{isTotal ? `Estimated Annual Loss (EAL)` : `EAL`}</label>
            <span className={"font-medium text-gray-800"}>
              ${fnumIndex(get(data, ealCol, 0))}
            </span>
          </div>
          {
            !isTotal &&
            <div className={"w-full -mt-4"}>
              <RenderSvgBar
                data={[{
                  label: "",
                  value: `${hazardPercentile}%`,
                  color: hazardsMeta[hazard].color,
                  width: hazardPercentile
                }]}
                height={svgBarHeight[size]}
                radius={svgBarRadius[size]}
                fontSizeInner={fontSizeInner[size]}
                fontSizeOuter={fontSizeOuter[size]}
              />
            </div>
          }
          {
            !isTotal &&
            <div className={blockClass[size]}><label>Actual Loss</label>
              <span className={"font-medium text-gray-800"}>
              ${fnumIndex(
                (Object.values(
                  get(falcorCache,
                    isTotal ? [...fusionPathTotal(fusionIds), "databyIndex"] : [...fusionPath(fusionIds), "databyIndex"],
                    {}))
                  .find(d => d.nri_category === hazard) || {})[actualDamageCol]
              )}
            </span>
            </div>
          }
          {
            !isTotal &&
              <>
                <div className={blockClass[size]}><label>Exposure</label>
                  <span className={"font-medium text-gray-800"}>
                    ${fnumIndex(get(falcorCache, [...nriPath(nriIds), "databyIndex", 0, expCol]))}
                  </span>
                </div>
                <div className={blockClass[size]}><label>Frequency</label>
                  <span className={"font-medium text-gray-800"}>
                    {freqToText((get(falcorCache, [...nriPath(nriIds), "databyIndex", 0, freqCol], 0)).toFixed(2))}
                  </span>
                </div>
              </>
          }
        </div>
      </div>
    </div>
  );
};