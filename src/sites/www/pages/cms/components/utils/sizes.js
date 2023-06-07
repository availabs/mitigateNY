

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

export const getSizeClass = (size, prevSize) => {
    if(["2"].includes(size)) { return sizes[size] }

    if(size === "2/3" && prevSize === '1/3' ) {
        return `md:col-start-3 lg:col-start-4 ${sizes[size]}`
    }
    if(size === "1/2" && prevSize === '1/2' ) {
        return `md:col-start-2 lg:col-start-5 ${sizes[size]}`
    }
    if(size === "1/3" && prevSize === '2/3' ) {
        return `md:col-start- 4 lg:col-start-6 ${sizes[size]}`
    } 
    return `lg:col-start-2 ${sizes[size]}`
}

export const sizeGridTemplate = {gridTemplateColumns: '1fr 170px 170px 170px 170px 170px 170px 1fr'}