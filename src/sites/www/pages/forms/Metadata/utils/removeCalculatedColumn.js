export const removeCalculatedColumn = ({update, pgEnv, falcor, metadata, setMetadata, col}) => {
    const md = {
        ...metadata,
        attributes: metadata.attributes.filter(attr => attr.name !== col)
    }
    setMetadata(md);
    update(md);
}