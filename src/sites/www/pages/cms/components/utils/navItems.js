// const baseUrl = ''

function getChildNav(item, dataItems, baseUrl='', edit) {
    let children = dataItems
        .filter(d => item.id && d.parent === item.id)
        .sort((a, b) => a.index - b.index)
    if (children.length === 0) return false

    return children.map((d, i) => {
        let item = {
            id: d.id,
            path: `${edit ? `${baseUrl}/edit` : baseUrl}/${d.url_slug || d.id}`,
            name: d.title
        }
        if (getChildNav(item, dataItems)) {
            item.subMenus = getChildNav(d, dataItems, baseUrl, edit)
        }
        return item
    })

}

export function dataItemsNav(dataItems, baseUrl = '', edit = false) {
    return dataItems
        .sort((a, b) => a.index - b.index)
        .filter(d => !d.parent)
        .map((d, i) => {
            let item = {
                id: d.id,
                path: `${edit ? `${baseUrl}/edit` : baseUrl}/${/*i === 0 && !edit ? '' : */d.url_slug || d.id}`,
                name: d.title
            }

            if (getChildNav(item, dataItems, baseUrl, edit)) {
                item.subMenus = getChildNav(d, dataItems, baseUrl, edit)
            }

            return item
        })
}