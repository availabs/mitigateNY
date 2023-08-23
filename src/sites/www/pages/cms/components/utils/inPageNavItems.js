import {getCurrentDataItem} from "./navItems.js";

export function getInPageNav(dataItems, baseUrl = '', edit = false) {
    const currentDI = getCurrentDataItem(dataItems, baseUrl);

    const menuItems = (currentDI?.sections || []).reduce((acc, {title, element, ...props}) => {

        if (!element || !title) return acc;
        const lexicalNavElements = element['element-type'] === 'lexical' || !element['element-type'] ?
            element['element-data']?.root?.children?.reduce((acc, {type, tag, children}) => {
                return type === 'heading' ?
                    [
                        ...acc,
                        {
                            name: children[0]?.text,
                            onClick: (e) => {
                                const elmntToView =
                                    [...window.document.querySelectorAll(tag)]
                                        .find(headerElement => headerElement?.children[0]?.innerHTML === children[0]?.text);
                                // .__lexicalKey_cgviu
                                elmntToView?.scrollIntoView({ behavior: "smooth", block:'center' });
                            },
                            className: `px-8 pb-1 text-sm text-slate-400 hover:text-slate-700 cursor-pointer border-r-2 mr-4
                            ${
                                [...window.document.querySelectorAll(tag)]
                                    .find(headerElement => headerElement?.children[0]?.innerHTML === children[0]?.text)?.offsetParent 
                                === null ? 'text-blue-200' : ''
                            }`
                        }
                    ] : acc
            }, []) : []

        return [
            ...acc,
            {
                name: title,
                onClick: (e) => {
                    const elmntToView = window.document.getElementById(`#${title?.replace(/ /g, '_')}`);
                    elmntToView?.scrollIntoView({ behavior: "smooth" });
                },
                className: 'px-6 pt-2 pb-1 uppercase text-sm text-blue-400 hover:underline cursor-pointer border-r-2 mr-4'
            },
            ...(lexicalNavElements || [])
        ]
    }, [])

    return {
        menuItems: menuItems,
        themeOptions: {
            size: 'full',
            color: 'transparent'
        }
    };
}