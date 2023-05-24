import { hazardsMeta } from "../../../../../../../utils/colors.jsx";
import get from "lodash/get.js";
import { fnumIndex, HoverComp } from "../../../../../../../utils/macros.jsx";
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

export const RenderBarChart = ({ chartDataActiveView, disaster_numbers, attributionData, baseUrl }) => (
    <div className={`w-full pt-10 my-1 block flex flex-col`} style={{ height: "450px" }}>
        <label key={"nceiLossesTitle"} className={"text-lg pb-2"}> Loss by Disaster Number
        </label>
        <RenderLegend />
        <BarGraph
            key={"numEvents"}
            data={chartDataActiveView}
            keys={disaster_numbers.map(dn => `${dn}_td`)}
            indexBy={"year"}
            axisBottom={{ tickDensity: 3, axisColor: '#000', axisOpacity: 0 }}
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
            <Link to={`/${baseUrl}/source/${ attributionData?.source_id }/versions/${attributionData?.view_id}`}>
                Attribution: { attributionData?.version }
            </Link>
        </div>
    </div>
);