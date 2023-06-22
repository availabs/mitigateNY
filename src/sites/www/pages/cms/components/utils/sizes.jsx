import React from "react";


export const sizeOptions = [
    {name: '2', icon: 'fal fa-align-justify'},
    {name: '1', icon: 'fal fa-align-center'},
    {name: '2/3', icon: 'fal fa-align-left'},
    {name: '1/2', icon: 'fal fa-align-right'},
    {name: '1/3', icon: 'fal fa-indent'}
]

const sizes = {
    "2": 'col-span-6 lg:col-span-8',
    "1": 'col-span-6',
    "2/3": 'col-span-6 md:col-span-4',
    "1/2": 'col-span-6 md:col-span-3',
    "1/3": 'col-span-6 md:col-span-2'
}

const pageSplitIcons = (size1=50, size2=50, height=20, width=30, lines=false) => (
    <svg width={width} height={height} >
        <line
            x1="0"
            y1="0"
            x2="0"
            y2={height}
            stroke="black"
            strokeDasharray="4 1.5 4 1.5" />
        <rect x={size1 === 100 ? 0 : 5} y="0"
              width={Math.floor(width * size1 / 100) - (size1 === 100 ? 0 : 6)} height={height} rx="1" ry="1"
              style={{fill:'white', stroke:'black', strokeWidth:1, opacity:0.5}} />
        <rect x={(width * size1 / 100) - 1} y="0"
              width={Math.floor(width * size2 / 100) - 6} height={height} rx="1" ry="1"
              style={{fill:'white', stroke:'black', strokeWidth:1, opacity:0.5}} />
        <line
            x1={width}
            y1="0"
            x2={width}
            y2={height}
            stroke="black"
            strokeDasharray="4 1.5 4 1.5" />
    </svg>
)

export const sizeOptionsSVG = [
    {name: '2', icon: pageSplitIcons(100, 0)},
    {name: '1', icon: pageSplitIcons(90, 0)},
    {name: '2/3', icon: pageSplitIcons(60, 40)},
    {name: '1/2', icon: pageSplitIcons(50, 50)},
    {name: '1/3', icon: pageSplitIcons(40, 60)}
]
export const getSizeClass = (size, prevSize, prevPrevSize) => {
    if(["2"].includes(size)) { return sizes[size] }

    if(size === "2/3" && prevSize === '1/3' ) {
        return `md:col-start-3 lg:col-start-4 ${sizes[size]}`
    }
    if(size === "1/2" && prevSize === '1/2' ) {
        return `md:col-start-2 lg:col-start-5 ${sizes[size]}`
    }
    if(size === "1/3" && prevSize === '2/3' ) {
        return `md:col-start-4 lg:col-start-6 ${sizes[size]}`
    }
     if(size === "1/3" && !prevSize) {
        return `md:col-start-2 lg:col-start-2 ${sizes[size]}`
    }
     if(size === "1/3" && prevSize === '1/3' && !prevPrevSize ) {
        return `md:col-start-3 lg:col-start-4 ${sizes[size]}`
    }
     if(size === "1/3" && prevSize === '1/3' && prevPrevSize === '1/3' ) {
        return `md:col-start-4 lg:col-start-6 ${sizes[size]}`
    }
    return `lg:col-start-2 ${sizes[size]}`
}

export const sizeGridTemplate = {gridTemplateColumns: '1fr repeat(6, minmax(100px, 190px)) 1fr'}