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
    1_000_000 : [10_000, 50_000, 500_000],
    500_000 : [1_000, 10_000, 50_000],
}

export const RenderBarChart = ({ chartDataActiveView, disaster_numbers, attributionData, baseUrl }) => {
    const [maxVal, setMaxVal] = React.useState('Max');
    const minYear = Math.min(...chartDataActiveView.map(d => d.year));
    const maxYear = Math.max(...chartDataActiveView.map(d => d.year));

    const keys = disaster_numbers.map(dn => `${dn}_td`);
    const yearWiseTotals = chartDataActiveView.map(d => keys.reduce((a,c) => a + (+d[c] || 0) ,0));
    const ticks =
        thresholdTicks[Math.min(...Object.keys(thresholdTicks)
            .filter(k => +k > Math.max(...yearWiseTotals)), Math.max(...Object.keys(thresholdTicks)))] || []

    const maxValue = maxVal === 'Max' ? Math.max(...yearWiseTotals) :
        fnumToNumber(maxVal);

    console.log('maxval', Math.min(...Object.keys(thresholdTicks)
        .filter(k => +k > Math.max(...yearWiseTotals))))
    return (
        <div className={`w-full pt-10 my-1 block flex flex-col`} style={{height: "450px"}}>
            <label key={"nceiLossesTitle"} className={"text-lg pb-2"}> Loss by Disaster Number
            </label>
            <RenderLegend/>
            <ButtonSelector types={[...ticks.map(t => fnumIndex(t, 0)), 'Max']}  type={maxVal} setType={setMaxVal} size={'large'}/>
            <BarGraph
                key={"numEvents"}
                data={chartDataActiveView}
                keys={keys}
                indexBy={"year"}
                xScale={{domain: range(minYear, maxYear)}}
                axisBottom={{tickDensity: 3, axisColor: '#000', axisOpacity: 0}}
                yScale={{domain: [0, maxValue]}}
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