export const editMetadata = async ({update, metadata, setMetadata, col, value}) => {
    // value = {meta-attr: meta-value}
    console.log('edit meta', col, value, metadata.attributes)
    const md = {
        ...metadata,
        attributes: metadata.attributes.map(d => {
            if (d.name === col) {
                return {
                    ...d, ...value
                }
            } else {
                return d;
            }
        })
    }
    console.log('md', JSON.parse(JSON.stringify(md)))
    await setMetadata(md);

    return update(JSON.stringify(md))
}
