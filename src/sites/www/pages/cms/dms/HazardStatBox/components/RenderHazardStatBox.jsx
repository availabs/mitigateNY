import get from "lodash/get.js";
import {RenderSvgBar} from "../svgBar.jsx";
import React from "react";
import {hazardsMeta} from "~/utils/colors.jsx";
import {fnumIndex} from "~/utils/macros.jsx";
import {scaleQuantize} from "d3-scale";

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

const freqToText = (f) => <span className={"pl-1"}>{f}<span className={"font-xs pl-1"}>events/yr</span></span>;
export const RenderHazardStatBox = ({
                                        isTotal,
                                        hazard,
                                        statePercentile,
                                        nationalPercentile,
                                        hazardPercentileArray,
                                        hazardPercentile,
                                        actualLoss,
                                        eal,
                                        exposure,
                                        frequency,
                                        size
                                    }) => {
    const ealCol = isTotal ? "avail_eal_total" : "avail_eal";

    const blockClass = {
        large: "flex flex-col pt-2 text-sm", small: "flex flex-row justify-between pt-2 text-xs"
    };
    const blockWrapper = {
        large: `flex flex-col justify-between shrink-0 ml-5 pt-2`, small: `flex flex-col`
    };
    const svgBarHeight = {large: 30, small: 12};
    const svgBarRadius = {large: 20, small: 10};
    const fontSizeInner = {large: "14.5px", small: "12.5px"};
    const fontSizeOuter = {large: "13.5px", small: "11.5px"};


    return (
        <div className={`border border-gray-200 p-5 ${eal ? `bg-white` : `bg-gray-100`}`}>
            <div className={"w-full border-b-2 flex "} style={{borderColor: get(hazardsMeta, [hazard, "color"], "")}}>
                {!isTotal &&
                    <div className={"rounded-full mt-1 mr-2 mb-0"}
                         style={{
                             height: "12px",
                             width: "12px",
                             backgroundColor: get(hazardsMeta, [hazard, "color"], "")
                        }}
                    />}
                {isTotal ? "Total" : hazardsMeta[hazard]?.name}
            </div>
            <div className={`w-full ${size === "large" ? `flex flex-row justify-between` : ``}`}>
                <div className={"w-full pr-1"}>
                    {
                        <div className={"w-full pt-1"}>
                            <RenderSvgBar
                                data={[{
                                    label: "Risk",
                                    value: (nationalPercentile)?.toFixed(2),
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
                    {isTotal &&
                        <div className={"w-full pt-4"}>
                            {
                                <RenderSvgBar
                                data={(hazardPercentileArray || [])
                                    .map((h, hI) => ({
                                            label: '',
                                            value: h.label,
                                            showValue: true,
                                            valueFloat: 'right',
                                            valueCutoff: 10,
                                            color: h.color,
                                            width: h.value
                                        }))}
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
                    <div className={blockClass[size]}><label
                        className={'break-word w-[25px]'}>{isTotal ? `Estimated Annual Loss (EAL)` : `EAL`}</label>
                        <span className={"font-medium text-gray-800"}>
                            ${fnumIndex(eal)}
                        </span>
                    </div>

                    {!isTotal &&
                        <div className={"w-full -mt-4"}>
                            <RenderSvgBar
                                data={[{
                                    label: "",
                                    value: `${hazardPercentile}%`,
                                    color: hazardsMeta[hazard]?.color,
                                    width: hazardPercentile
                                }]}
                                height={svgBarHeight[size]}
                                radius={svgBarRadius[size]}
                                fontSizeInner={fontSizeInner[size]}
                                fontSizeOuter={fontSizeOuter[size]}
                            />
                        </div>
                    }
                    {!isTotal &&
                        <div className={blockClass[size]}><label>Actual Loss</label>
                            <span className={"font-medium text-gray-800"}>
                                ${fnumIndex(actualLoss)}
                            </span>
                        </div>
                    }
                    {!isTotal &&
                        <>
                            <div className={blockClass[size]}><label>Exposure</label>
                                <span className={"font-medium text-gray-800"}>
                                    ${fnumIndex(exposure)}
                                </span>
                            </div>
                            <div className={blockClass[size]}><label>Frequency</label>
                                <span className={"font-medium text-gray-800"}>
                                    {freqToText((frequency || 0)?.toFixed(2))}
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>);
}