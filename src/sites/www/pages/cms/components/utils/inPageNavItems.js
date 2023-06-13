import {getCurrentDataItem} from "./navItems.js";

export function getInPageNav(dataItems, baseUrl = '', edit = false) {
    const currentDI = getCurrentDataItem(dataItems, baseUrl);

    const menuItems = currentDI?.sections?.reduce((acc, {title, element, ...props}) => {

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
                            className: `px-6 pb-1 text-sm cursor-pointer border-l-2 ml-2
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
                className: 'px-6 pt-2 pb-1 uppercase text-xs text-blue-400 cursor-pointer border-l-2 ml-2'
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