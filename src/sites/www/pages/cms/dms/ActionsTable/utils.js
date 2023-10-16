import get from "lodash/get.js";

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
                    const modifiedName = fn[mdC.name] && fn[mdC.name].includes('data->>') ? fn[mdC.name] :
                        fn[mdC.name] && !fn[mdC.name].includes('data->>') && fn[mdC.name].toLowerCase().includes(' as ') ?
                            fn[mdC.name].replace(mdC.name, `data->>'${mdC.name}'`) :
                            fn[mdC.name] && !fn[mdC.name].includes('data->>') && !fn[mdC.name].toLowerCase().includes(' as ') ?
                                `${fn[mdC.name].replace(mdC.name, `data->>'${mdC.name}'`)} as ${mdC.name}` :
                                `data->>'${mdC.name}' as ${mdC.name}`;
                    
                    
                    if(currentMetaLookup?.view_id){
                        const currentViewIdLookup = metaLookupByViewId?.[mdC.name] || [];
                        row[modifiedName] = currentViewIdLookup?.[row[modifiedName]]?.name || row[modifiedName];
                    }else{
                        row[modifiedName] = currentMetaLookup?.[row[modifiedName]] || row[modifiedName];
                    }
                })
                return row;
            })
        setData(dataWithMeta)
    }else{
        setData(filterData({geoAttribute, geoid, data, actionType}))
    }
}