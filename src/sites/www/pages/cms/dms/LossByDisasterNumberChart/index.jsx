import React, {useEffect, useMemo, useState} from "react";
import { Select } from '~/modules/avl-components/src';
import { BarGraph } from '~/modules/avl-graph/src';
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { fnumIndex, HoverComp } from "~/utils/macros.jsx";
import {hazardsMeta} from "~/utils/colors.jsx";
import {Link} from "react-router-dom";
import get from "lodash/get";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    disaster_number: 'Disaster Number',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
};

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const RenderLegend = () =>
    (
        <div className={"grid grid-cols-9 gap-1 text-xs align-middle"}>
            {
                Object.keys(hazardsMeta)
                    .map(key =>
                        <div className={"h-full flex"} key={key}>
              <span className={"rounded-full m-1"}
                    style={{
                        height: "10px",
                        width: "10px",
                        backgroundColor: get(hazardsMeta, [key, "color"], "#ccc")
                    }} />
                            <label className={"pl-2"}>{hazardsMeta[key].name}</label>
                        </div>)
            }
        </div>
    );

const RenderBarChart = ({ chartDataActiveView, disaster_numbers, attributionData, baseUrl }) => (
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

const ProcessDataForMap = (data=[], disasterNames) => React.useMemo(() => {
    const years = [...new Set(data.map(d => d.year))];
    const disaster_numbers = new Set(['Non-declared Disasters']);
    const event_ids = new Set();
    const swdTotal = {swd_tpd: 0, swd_tcd: 0, swd_ttd: 0};
    const ofdTotal = {ofd_tpd: 0, ofd_tcd: 0, ofd_ttd: 0};

    const processed_data = years.map(year => {
        const swdTotalPerYear = {swd_pd: 0, swd_cd: 0, swd_td: 0};
        const ofdTotalPerYear = {ofd_pd: 0, ofd_cd: 0, ofd_td: 0};

        const lossData = data
            .filter(d => d.year === year)
            .reduce((acc, d) => {
                const nri_category = d.nri_category;
                const tmpDn = d.disaster_number === 'SWD' ? 'Non-declared Disasters' :
                    get(disasterNames, [d.disaster_number], 'No Title') + ` (${d.disaster_number} - ${nri_category})`;
                const tmpPd = +d.fusion_property_damage || 0,
                    tmpCd =  +d.fusion_crop_damage || 0,
                    tmptd = tmpPd + tmpCd + (+d.swd_population_damage || 0);

                if(tmpDn.includes('Non-declared Disasters')){
                    event_ids.add(tmpDn.split('_')[1]);
                    swdTotalPerYear.swd_pd += tmpPd;
                    swdTotalPerYear.swd_cd += tmpCd;
                    swdTotalPerYear.swd_td += tmptd;

                    swdTotal.swd_tpd += tmpPd;
                    swdTotal.swd_tcd += tmpCd;
                    swdTotal.swd_ttd += tmptd;
                }else{
                    disaster_numbers.add(tmpDn);
                    ofdTotalPerYear.ofd_pd += tmpPd;
                    ofdTotalPerYear.ofd_cd += tmpCd;
                    ofdTotalPerYear.ofd_td += tmptd;

                    ofdTotal.ofd_tpd += tmpPd;
                    ofdTotal.ofd_tcd += tmpCd;
                    ofdTotal.ofd_ttd += tmptd;
                }

                return {
                    ...acc, ...{
                        [`${tmpDn}_pd`]: (acc[[`${tmpDn}_pd`]] || 0) + tmpPd,
                        [`${tmpDn}_cd`]: (acc[`${tmpDn}_cd`] || 0) + tmpCd,
                        [`${tmpDn}_td`]: (acc[`${tmpDn}_td`] || 0) + tmptd,
                        [`${tmpDn}_nri_category`]: nri_category
                    }
                };
            }, {});
        return { year, ...lossData, ...swdTotalPerYear, ...ofdTotalPerYear };
    });

    return { processed_data, total: [{...swdTotal, ...ofdTotal, ...{ "year": "Loss Distribution" }}], disaster_numbers: [...disaster_numbers], event_ids: [...event_ids] };
}, [data, disasterNames]);

const Edit = ({value, onChange}) => {
    console.log('edit', value, pgEnv);
    const { falcor, falcorCache } = useFalcor();

    let data = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const [disasterDecView, setDisasterDecView] = useState();
    const [disasterNumbers, setDisasterNumbers] = useState([]);

    const ealSourceId = 229,
        ealViewId = 599;
    const fusionSourceId = 336,
        fusionViewId = 596;
    const geoid = '36';

    const dependencyPath = ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", ealViewId];
    const disasterNameAttributes = ['distinct disaster_number as disaster_number', 'declaration_title'],
        disasterNamePath = (view_id) =>
            ['dama', pgEnv,  "viewsbyId", view_id,
                "options"];

    useEffect( () => {
        async function getData(){
            return falcor.get(dependencyPath).then(async res => {

                const deps = get(res, ["json", ...dependencyPath, "dependencies"]);
                console.log('deps', deps)
                const fusionView = deps.find(d => d.type === "fusion");
                const lossRes = await falcor.get(
                    ["fusion", pgEnv, "source", fusionSourceId, "view", fusionViewId, "byGeoid", geoid, ["lossByYearByDisasterNumber"]],
                    ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes', ['source_id', 'view_id', 'version']]
                );

                const disasterNumbers = get(lossRes,
                    ['json', "fusion", pgEnv, "source", fusionSourceId, "view",
                        fusionViewId, "byGeoid", geoid, "lossByYearByDisasterNumber"], [])
                    .map(dns => dns.disaster_number)
                    .filter(dns => dns !== 'SWD')
                    .sort((a, b) => +a - +b);

                if(disasterNumbers.length){
                    const ddcView = deps.find(d => d.type === "disaster_declarations_summaries_v2");
                    setDisasterNumbers(disasterNumbers);
                    setDisasterDecView(ddcView.view_id);
                    return falcor.get([...disasterNamePath(ddcView.view_id), JSON.stringify({ filter: { disaster_number: disasterNumbers.sort((a, b) => +a - +b)}}),
                        'databyIndex', {from: 0, to: disasterNumbers.length - 1}, disasterNameAttributes]);
                }
            })
        }

        getData()
    }, [geoid]);

    const disasterNames = Object.values(get(falcorCache, [...disasterNamePath(disasterDecView)], {})).reduce((acc, d) => [...acc, ...Object.values(d?.databyIndex || {})], [])
        .reduce((acc, disaster) => {
            acc[disaster['distinct disaster_number as disaster_number']] = disaster.declaration_title;
            return acc;
        }, {});

    const lossByYearByDisasterNumber = get(falcorCache, ["fusion", pgEnv, "source", fusionSourceId, "view",
            fusionViewId, "byGeoid", geoid, "lossByYearByDisasterNumber", "value"], []),
        { processed_data: chartDataActiveView, disaster_numbers, total } = ProcessDataForMap(lossByYearByDisasterNumber, disasterNames);
    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', fusionViewId, 'attributes'], {});
    console.log('d?', lossByYearByDisasterNumber, chartDataActiveView, disaster_numbers, attributionData)

    useEffect(() => onChange(JSON.stringify({chartDataActiveView, disaster_numbers, attributionData})),
        [chartDataActiveView, disaster_numbers, attributionData]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <RenderBarChart chartDataActiveView={chartDataActiveView} disaster_numbers={disaster_numbers} attributionData={attributionData} baseUrl={baseUrl}/>
            </div>
        </div>
    )
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}

const View = ({value}) => {
    if(!value) return ''
    console.log('value', value, pgEnv)
    let data = typeof value === 'object' ? 
        value['element-data'] : 
        JSON.parse(value)
    return (
        <div className='relative w-full border border-dashed p-6'>
            <RenderBarChart {...JSON.parse(value)} baseUrl={'/'}/>
        </div>
    )           
}


export default {
    "name": 'ColorBox',
    "EditComp": Edit,
    "ViewComp": View
}