import React, {useEffect, useMemo, useState} from "react";
import {AvlMap} from '~/modules/avl-maplibre/src';
import {ChoroplethCountyFactory} from "./layers/choroplethCountyLayer.jsx";
import * as d3scale from "d3-scale";
import {d3Formatter} from "~/utils/macros.jsx";
import {CirclesFactory} from "./layers/circlesLayer.jsx";
import {scaleLinear} from "d3-scale";

const widths = {
    '1/3': 290,
    '2/3': 370,
    '1/2': 370,
    '2': 370,
    '1': 370,
    [undefined]: 370
}

const RenderChoroplethLegend = ({size, domain, range, fmt, title,}) => {
    const RenderLegendBox = ({value, color, fmt, className}) => {
        const width = `${widths[size] / (range.length + 1)}px`,
            heightParent = '40px',
            heightChild = '20px';
        return (
            <div className={`flex flex-col h-[${heightParent}] ${className}`} style={{width}}>
                <div className={`h-[${heightChild}]`} style={{backgroundColor: color, width}}/>
                <div className={`h-[${heightChild}] text-xs text-right`} style={{width}}>
                    { fmt ? fmt(value) : value }
                </div>
            </div>
        )
    }
    return (
        <div className={`relative w-[${widths[size]}px] float-left mt-[20px] m-5 -mb-[100px] rounded-md`}
             style={{zIndex: 10}}>
            {
                title && <label className={'font-sm pl-2'}>{title}</label>
            }
            <div className={'flex flex-row justify-center inline-block align-middle pt-2.5'}>
                {
                    range.map((r, i) => {
                        return <RenderLegendBox value={domain[i]} color={r} fmt={fmt}/>
                    })
                }
                <RenderLegendBox value={'N/A'} color={'#d0d0ce'} className={'ml-1'}/>
            </div>
        </div>
    )
}

const RenderCirclesLegend = ({size, domain, range, fmt, title,}) => {

    const minValue =  Math.min(...domain);
    const maxValue = Math.max(...domain);
    console.log('???????/', range)

    const RenderLegendBox = ({value, color, fmt, className}) => {
        const label =  fmt ? fmt(value) : value ;
        const size = label.replace(/[a-z,A-Z]/, '')
        return (
            <div className={'flex flex-row'}>
                <div className={`h-[${size}px] w-[${size}px] border-2 rounded-full text-center`} />
                <span className={'self-center'}>{label}</span>
            </div>
        )
    }
    return (
        <div className={`relative w-[${widths[size]}px] float-left mt-[20px] m-5 -mb-[100px] rounded-md`}
             style={{zIndex: 10}}>
            {
                title && <label className={'font-sm pl-2'}>{title}</label>
            }
            <div className={'flex flex-col justify-center inline-block align-middle pt-2.5'}>
                <RenderLegendBox value={minValue} fmt={fmt}/>
                <RenderLegendBox value={maxValue} fmt={fmt}/>
            </div>
        </div>
    )
}

const DrawLegend = ({
                        domain=[],
                        range=[],
                        title,
                        scaleType = 'quantile',
                        type = 'Choropleth',
                        format = '0.2s',
                        size,
                        show = true
}) => {
    if(!show) return null;

    let scale;
    switch (scaleType) {
        case "linear":
            scale = scaleLinear()
                .domain([Math.min(...domain), Math.max(...domain)])
                .range(range);
            break;
        case "quantile":
            scale = d3scale.scaleQuantile()
                .domain(domain)
                .range(range);
            break;
        case "quantize":
            scale = d3scale.scaleQuantize()
                .domain(domain)
                .range(range);
            break;
        case "threshold":
            scale = d3scale.scaleThreshold()
                .domain(domain)
                .range(range);
            break;

    }

    const fmt = (typeof format === "function") ? format : d3Formatter(format);

    return type === 'Choropleth' ?
        <RenderChoroplethLegend domain={domain} range={range} fmt={fmt} size={size} title={title}/> :
        <RenderCirclesLegend domain={domain} range={range} fmt={fmt} size={size} title={title}/>

}
export const RenderMap = ({falcor, layerProps, legend, layers=['Choropleth']}) => {
    const layersMap = {
        Choropleth: ChoroplethCountyFactory,
        Circles: CirclesFactory
    }

    const mapLayers = React.useRef(
        layers.map(l => layersMap[l]())
    );

    return (
        <>
            <DrawLegend {...legend} />
            <AvlMap
                falcor={falcor}
                mapOptions={{
                    styles: [
                        {
                            name: 'blank',
                            style: {
                                sources: {},
                                version: 8,
                                layers: [{
                                    "id": "background",
                                    "type": "background",
                                    "layout": {"visibility": "visible"},
                                    "paint": {"background-color": 'rgba(208, 208, 206, 0)'}
                                }]
                            }
                        },
                        {
                            name: "Light",
                            style: "https://api.maptiler.com/maps/dataviz-light/style.json?key=mU28JQ6HchrQdneiq6k9"
                        }]

                }}
                layers={mapLayers.current}
                layerProps={layerProps}
                CustomSidebar={() => <div/>}
            />
        </>
    )
}