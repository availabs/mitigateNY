import get from "lodash/get.js";

export async function getMeta({actionsConfig, metaLookupByViewId={}, setMetaLookupByViewId, visibleCols, pgEnv, falcor, geoid}){
    const metaViewIdLookupCols =
        actionsConfig.attributes
            .filter(md =>
                visibleCols.includes(md.label) &&
                md.geoVariable &&
                md.meta_lookup &&
                !metaLookupByViewId[md.label]
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

                    return {...prev, ...{[md.label]: data}};
                }, {});
        setMetaLookupByViewId({...metaLookupByViewId, ...data});
    }
}

export async function setMeta({actionsConfig, visibleCols, data, setData, metaLookupByViewId}) {
    const metaLookupCols =
        actionsConfig.attributes?.filter(md =>
            visibleCols.includes(md.label) && md.geoVariable
        );

    if(metaLookupCols?.length){
        console.log('metaLookupCols', metaLookupCols, metaLookupByViewId)
        const dataWithMeta = data
            .map(row => {
                metaLookupCols.forEach(mdC => {
                    const currentMetaLookup = mdC.meta_lookup;

                    if(currentMetaLookup?.view_id){
                        const currentViewIdLookup = metaLookupByViewId?.[mdC.label] || [];
                        row[mdC.key] = currentViewIdLookup[row[mdC.key]]?.name || row[mdC.key];
                    }else{
                        row[mdC.key] = currentMetaLookup[row[mdC.key]] || row[mdC.key];
                    }
                })
                return row;
            })
        setData(dataWithMeta)
    }else{
        setData(data)
    }
}