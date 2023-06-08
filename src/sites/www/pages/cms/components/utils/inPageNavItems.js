import {getCurrentDataItem} from "./navItems.js";

export function getInPageNav(dataItems, baseUrl = '', edit = false) {
    const currentDI = getCurrentDataItem(dataItems, baseUrl);

    const menuItems = currentDI?.sections?.reduce((acc, {title, element, ...props}) => {
        console.log('section: ', title, element, props)
        if (!element || !title) return acc;

        const lexicalNavElements = element['element-type'] === 'lexical' ?
            element['element-data']?.root?.children?.reduce((acc, {type, children}) => {
                return type === 'heading' ?
                    [
                        ...acc,
                        {
                            name: children[0]?.text,
                            onClick: (e) => {
                                console.log('clicking', e, title.replace(/ /g, '_'))
                                const elmntToView = window.document.getElementById(`#${title?.replace(/ /g, '_')}`);
                                elmntToView?.scrollIntoView({ behavior: "smooth" });
                            },
                            className: 'px-6 pb-1 text-sm'
                        }
                    ] : acc
            }, []) : []

        return [
            ...acc,
            {
                name: title,
                onClick: (e) => {
                    console.log('clicking', e, title.replace(/ /g, '_'))
                    const elmntToView = window.document.getElementById(`#${title?.replace(/ /g, '_')}`);
                    elmntToView?.scrollIntoView({ behavior: "smooth" });
                },
                className: 'px-6 pt-8 pb-1 uppercase text-xs text-blue-400'
            },
            ...(lexicalNavElements || [])
        ]
    }, [])
    console.log('MI?', menuItems)

    return {
        menuItems: menuItems,
        size: 'full',
        color: 'white'
    };
}