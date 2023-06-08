import { hazardsMeta } from "../../../../../../../utils/colors.jsx";
import get from "lodash/get.js";
import {fnum, fnumIndex, fnumToNumber, HoverComp, range} from "../../../../../../../utils/macros.jsx";
import { Link } from "react-router-dom";
import React from "react";
import { BarGraph } from "../../../../../../../modules/avl-graph/src/index.js";
import { RenderLegend } from "./RenderLegend.jsx";
import {ButtonSelector} from "../../buttonSelector/index.jsx";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    disaster_number: 'Disaster Number',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
};

const thresholdTicks = {
    10_000_000_000 : [50_000_000, 1_000_000_000, 5_000_000_000],
    5_000_000_000 : [1_000_000, 50_000_000, 1_000_000_000],
    1_000_000_000 : [500_000, 1_000_000, 500_000_000],
    70_000_000 : [20_000_000, 30_000_000, 50_000_000],
    50_000_000 : [10_000_000, 20_000_000, 30_000_000],
    25_000_000 : [10_000_000, 15_000_000, 20_000_000],
    20_000_000 : [5_000_000, 10_000_000, 15_000_000],
    15_000_000 : [1_000_000, 5_000_000, 10_000_000],
    10_000_000 : [500_000, 1_000_000, 5_000_000],
    5_000_000 : [50_000, 500_000, 1_000_000],
    1_000_000 : [10_000, 50_000, 500_000],
    500_000 : [1_000, 100_000, 250_000],
}

export const RenderBarChart = ({ chartDataActiveView, disaster_numbers, attributionData, baseUrl }) => {
    const [threshold, setThreshold] = React.useState('Max');
    const minYear = Math.min(...chartDataActiveView.map(d => d.year));
    const maxYear = Math.max(...chartDataActiveView.map(d => d.year));

    const keys = disaster_numbers.map(dn => `${dn}_td`);
    const yearWiseTotals = chartDataActiveView.map(d => keys.reduce((a,c) => a + (+d[c] || 0) ,0));
    const maxValue = Math.max(...yearWiseTotals);
    const maxValueFormatted = +fnumIndex(maxValue, maxValue.toString().length).trim().split(' ')[0];
    const roundingMultiplier = Math.ceil(maxValueFormatted / 5);
    const roundedMaxValue = 5 * roundingMultiplier;
    const multiplier = (n = 100) =>
        (parseInt(maxValue / maxValueFormatted) +
        n -
        (parseInt(maxValue / maxValueFormatted) % n || n)
        ) /
        ( parseInt(maxValueFormatted) === 1 ? 5 : 1);
    const stopPoints = [0.05, 0.5, 0.75];
    const ticks = stopPoints.map(p => roundedMaxValue * p * multiplier());

    const upperLimit = threshold === 'Max' ? maxValue : fnumToNumber(threshold);
    console.log('??', parseInt(maxValueFormatted), maxValue, maxValueFormatted, maxValue / maxValueFormatted,

        parseInt(maxValue / maxValueFormatted) + 10000000 - (parseInt(maxValue / maxValueFormatted) % 1000000 ),
            fnumIndex(multiplier())
    )

    return (
        <div className={`w-full pt-10 my-1 block flex flex-col`} style={{height: "450px"}}>
            <label key={"nceiLossesTitle"} className={"text-lg pb-2"}> Loss by Disaster Number
            </label>
            <RenderLegend/>
            <ButtonSelector types={[...ticks.map(t => fnumIndex(t, 0)), 'Max']}  type={threshold} setType={setThreshold}/>
            <BarGraph
                key={"numEvents"}
                data={chartDataActiveView}
                keys={keys}
                indexBy={"year"}
                xScale={{domain: range(minYear, maxYear)}}
                axisBottom={{tickDensity: 3, axisColor: '#000', axisOpacity: 0}}
                yScale={{domain: [0, upperLimit]}}
                axisLeft={{
                    format: d => fnumIndex(d, 0),
                    gridLineOpacity: 0,
                    showGridLines: true,
                    ticks: 5,
                    // tickValues: [5_000_000, 500_000_000, 700_000_000, 10_000_000_000, 20_000_000_000],
                    axisColor: '#000',
                    axisOpacity: 0
                }}
                paddingInner={0.1}
                colors={(value, ii, d, key) => {
                    return key?.split('_')[0] === 'Non-declared Disasters' ? '#be00ff' : get(hazardsMeta, [d[`${key?.split('_')[0]}_nri_category`], 'color'], '#be00ff')
                }}
                hoverComp={{
                    HoverComp: HoverComp,
                    valueFormat: fnumIndex,
                    keyFormat: k => colNameMapping[k] || k.replace('_td', '')
                }}
                groupMode={"stacked"}
            />
            <div className={'text-xs text-gray-700 p-1'}>
                <Link to={`/${baseUrl}/source/${attributionData?.source_id}/versions/${attributionData?.view_id}`}>
                    Attribution: {attributionData?.version}
                </Link>
            </div>
        </div>
    )
};