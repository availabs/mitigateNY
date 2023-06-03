import { hazardsMeta } from "../../../../../../../utils/colors.jsx";
import get from "lodash/get.js";
import { fnumIndex, HoverComp, range } from "../../../../../../../utils/macros.jsx";
import { Link } from "react-router-dom";
import React from "react";
import { BarGraph } from "../../../../../../../modules/avl-graph/src/index.js";
import { RenderLegend } from "./RenderLegend.jsx";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    disaster_number: 'Disaster Number',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
};

const RenderSlider = ({value, setValue}) => (
    <div className={'w-full pt-2 mt-3 flex flex-row self-center'}>
        <label
            htmlFor="steps-range"
            className="shrink-0 pr-2 py-2 my-1 text-xs font-light dark:text-white">
            Zoom</label>
        <button onClick={() => setValue(--value)}><i className={'fad fa-minus self-center px-2'} /></button>
        <input id="steps-range"
               type="range"
               min={0} max={99}
               value={value} onChange={e => setValue(e.target.value)}
               step="0.5"
               className="
               py-2 my-1 rounded-md w-full shrink self-center
               h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        <button onClick={() => setValue(++value)}><i className={'fad fa-plus self-center px-2'} /></button>

    </div>
)

export const RenderBarChart = ({ chartDataActiveView, disaster_numbers, attributionData, baseUrl }) => {
    const [zoom, setZoom] = React.useState(0);
    const minYear = Math.min(...chartDataActiveView.map(d => d.year));
    const maxYear = Math.max(...chartDataActiveView.map(d => d.year));

    const keys = disaster_numbers.map(dn => `${dn}_td`)
    const yearWiseTotals = chartDataActiveView.map(d => keys.reduce((a,c) => a + (+d[c] || 0) ,0));
    const maxValue = Math.max(...yearWiseTotals) * (100 - zoom) / 100

    return (
        <div className={`w-full pt-10 my-1 block flex flex-col`} style={{height: "450px"}}>
            <label key={"nceiLossesTitle"} className={"text-lg pb-2"}> Loss by Disaster Number
            </label>
            <RenderLegend/>
            <RenderSlider value={zoom} setValue={setZoom}/>
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