import get from "lodash/get.js";

export const defaultOpenOutAttributes = [/*'description_of_problem_being_mitigated', 'solution_description'*/]
const jsonAccessor = 'data->';
const textAccessor = 'data->>';
export const getAccessor = (col) => col.includes('associated_hazards') ? jsonAccessor : textAccessor;
export const getColAccessor = (fn, col, origin) => origin === 'calculated-column' ? col :
    fn[col] && fn[col].includes('data->') ? fn[col] :
    fn[col] && !fn[col].includes('data->') && fn[col].toLowerCase().includes(' as ') ?
        fn[col].replace(col, `${getAccessor(col)}'${col}'`) :
        fn[col] && !fn[col].includes('data->') && !fn[col].toLowerCase().includes(' as ') ?
            `${fn[col].replace(col, `${getAccessor(col)}'${col}'`)} as ${col}` :
            `${getAccessor(col)}'${col}' as ${col}`;

const handleExpandableRows = (data, attributes, columns) => {
    const openOutAttributes =
        attributes
            .filter(attr => attr.openOut || defaultOpenOutAttributes.includes(attr.name))
            .map(attr => attr.name);
    const expandableColumns = columns.filter(c => openOutAttributes.includes(c.name))
    if(expandableColumns?.length){
        const newData = data.map(row => {
            const newRow = {...row}
            newRow.expand = []
            newRow.expand.push(
                ...expandableColumns.map(col => ({key: attributes.find(attr => attr.name === col.name)?.display_name || col.name, value: row[col.accessor]}))
            )
            expandableColumns.forEach(col => delete newRow[col.accessor])
            return newRow;
        });
        return newData;
    }else{
        return data
    }
}
export async function getMeta({actionsConfig, metaLookupByViewId={}, setMetaLookupByViewId, visibleCols, pgEnv, falcor, geoid}){
    const metaViewIdLookupCols =
        actionsConfig.attributes
            .filter(md =>
                visibleCols.includes(md.name) &&
                md.geoVariable &&
                md.meta_lookup &&
                !metaLookupByViewId[md.name]
            );
    if(metaViewIdLookupCols?.length){
        const data =
            await metaViewIdLookupCols
                .filter(md => md.meta_lookup?.view_id)
                .reduce(async (acc, md) => {
                    const prev = await acc;
                    const metaLookup = md.meta_lookup;
                    const options = JSON.stringify({
                        aggregatedLen: metaLookup.aggregatedLen,
                        filter: {
                            ...metaLookup?.geoAttribute && {[`substring(${metaLookup.geoAttribute}::text, 1, ${geoid?.length})`]: [geoid]},
                            ...(metaLookup?.filter || {})
                        }
                    });
                    const attributes = metaLookup.attributes;
                    const keyAttribute = metaLookup.keyAttribute;

                    const lenPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'length'];

                    const lenRes = await falcor.get(lenPath);
                    const len = get(lenRes, ['json', ...lenPath], 0);

                    if(!len) return Promise.resolve();

                    const dataPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'databyIndex'];
                    const dataRes = await falcor.get([...dataPath, {from: 0, to: len - 1}, attributes]);
                    const data = Object.values(get(dataRes, ['json', ...dataPath], {}))
                        .reduce((acc, d) => (
                            {
                                ...acc,
                                ...{[d[keyAttribute]]: {...attributes.reduce((acc, attr) => ({...acc, ...{[attr]: d[attr]}}), {})}}
                            }
                        ), {})

                    return {...prev, ...{[md.name]: data}};
                }, {});
        setMetaLookupByViewId({...metaLookupByViewId, ...data});
    }
}

const filterData = ({geoAttribute, geoid, data, actionType}) =>
    data.filter(d => {
            return !geoAttribute ||
                actionType === 'shmp' ||
                d[geoAttribute] === geoid ||
                (geoid?.length === 2 && d[geoAttribute]?.substring(0, 2) === geoid) // todo: geofilters should move to data call
        }
    );

export async function setMeta({
                                  actionsConfig, 
                                  visibleCols, 
                                  data, setData, 
                                  metaLookupByViewId, 
                                  geoAttribute, geoid, 
                                  actionType, 
                                  fn
                    }) {

    const metaLookupCols =
        actionsConfig.attributes?.filter(md =>
            visibleCols.includes(md.name) && ['meta-variable', 'geoid-variable'].includes(md.display)
        );

    if(metaLookupCols?.length){
        const dataWithMeta = filterData({geoAttribute, geoid, data, actionType})
            .map(row => {
                metaLookupCols.forEach(mdC => {
                    const currentMetaLookup = mdC.meta_lookup;
                    const modifiedName = fn[mdC.name] && fn[mdC.name].includes('data->') ? fn[mdC.name] :
                        fn[mdC.name] && !fn[mdC.name].includes('data->') && fn[mdC.name].toLowerCase().includes(' as ') ?
                            fn[mdC.name].replace(mdC.name, `${getAccessor(mdC.name)}'${mdC.name}'`) :
                            fn[mdC.name] && !fn[mdC.name].includes('data->') && !fn[mdC.name].toLowerCase().includes(' as ') ?
                                `${fn[mdC.name].replace(mdC.name, `${getAccessor(mdC.name)}'${mdC.name}'`)} as ${mdC.name}` :
                                `${getAccessor(mdC.name)}'${mdC.name}' as ${mdC.name}`;
                    
                    
                    if(currentMetaLookup?.view_id){
                        const currentViewIdLookup = metaLookupByViewId?.[mdC.name] || [];
                        const currentRawValue = row[modifiedName];
                        if(currentRawValue?.includes(',')){
                            row[modifiedName] =  currentRawValue.split(',').reduce((acc, curr) => [...acc, currentViewIdLookup?.[curr?.trim()]?.name || curr] , []).join(', ')
                        }else{
                            row[modifiedName] = currentViewIdLookup?.[row[modifiedName]]?.name || row[modifiedName];
                        }
                    }else{
                        row[modifiedName] = currentMetaLookup?.[row[modifiedName]] || row[modifiedName];
                    }
                })
                return row;
            })
        setData(handleExpandableRows(
            dataWithMeta,
            actionsConfig.attributes,
            visibleCols.map(vc => ({
                name: vc,
                accessor: getColAccessor(fn, vc, actionsConfig.attributes?.find(attr => attr.name === vc)?.origin)
            }))
        ))
    }else{
        setData(handleExpandableRows(
            filterData({geoAttribute, geoid, data, actionType}),
            actionsConfig.attributes,
            visibleCols.map(vc => ({
                name: vc,
                accessor: getColAccessor(fn, vc, actionsConfig.attributes?.find(attr => attr.name === vc)?.origin)
            }))
        ))
    }
}