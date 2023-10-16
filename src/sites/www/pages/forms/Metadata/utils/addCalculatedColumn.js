export const addCalculatedColumn = ({update, metadata, setMetadata, col}) => {
    const md = {
        ...metadata,
        attributes: [...metadata.attributes, col]
    }
    setMetadata(md);
    update(md);
}