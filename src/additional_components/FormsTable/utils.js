import get from "lodash/get.js";
import {getNestedValue} from "../../component_registry/utils/getNestedValue.js";
// const getNestedValue = (obj) => typeof obj?.value === 'object' ? getNestedValue(obj.value) : obj?.value || obj;

export const defaultOpenOutAttributes = [/*'description_of_problem_being_mitigated', 'solution_description'*/];
const array_columns = {
    "Actions": [
        'associated_hazards',
        'domain_categorization'
    ],
    "Capabilities": [
        'associated_hazards',
        'buildings',
        'infrastructure',
        'natural_environment',
        'emergency_management_phase',
        'category',
        'integrated_capacity_building',
        'climate_change',
        'status',
        'can_provide_fun_or_resources_for',
        'funding_source_type',
        'eligibility'
    ],
    "Mitigation Measures": [
        'associated_hazards',
        'planning_and_regulatory',
        'property_protection_and_infrastructure',
        'natural_resource_protection_and_restoration'
    ],
    "R+V Matrix": [
        'associated_hazards'
    ]
}
const jsonAccessor = 'data->';
const textAccessor = 'data->>';
export const getAccessor = (col, form) => {
    return array_columns[form]?.find(array_col => col.includes(array_col)) ? jsonAccessor : textAccessor;
}
export const getColAccessor = (fn, col, origin, form) => (origin === 'calculated-column' || !col) ? (fn[col] || col):
    fn[col] && fn[col].includes('data->') ? fn[col] :
        fn[col] && !fn[col].includes('data->') && fn[col].toLowerCase().includes(' as ') ?
            fn[col].replace(col, `${getAccessor(col, form)}'${col}'`) :
            fn[col] && !fn[col].includes('data->') && !fn[col].toLowerCase().includes(' as ') ?
                `${fn[col].replace(col, `${getAccessor(col, form)}'${col}'`)} as ${col}` :
                `${getAccessor(col, form)}'${col}' as ${col}`;

export const mapColName = (columns, col) => columns.find(c => c.name === col)?.accessor;

const handleExpandableRows = (data, attributes, openOutCols, columns) => {
    const openOutAttributes =
        attributes
            .filter(attr => openOutCols?.includes(attr.name) || defaultOpenOutAttributes?.includes(attr.name))
            .map(attr => attr.name);
    const expandableColumns = columns.filter(c => openOutAttributes.includes(c.name))
    if (expandableColumns?.length) {
        const newData = data.map(row => {
            const newRow = {...row}
            newRow.expand = []
            newRow.expand.push(
                ...expandableColumns.map(col => {
                    const value = getNestedValue(row[col.accessor]);

                    return {
                        key: attributes.find(attr => attr.name === col.name)?.display_name || col.name,
                        accessor: col.accessor,
                        value: Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? '' : value, // to display arrays
                        originalValue: Array.isArray(value) ? value : typeof value === 'object' ? '' : value // to filter arrays
                    }
                })
            )
            expandableColumns.forEach(col => delete newRow[col.accessor])
            return newRow;
        });
        return newData;
    } else {
        return data
    }
}

export async function getMeta({
                                  formsConfig,
                                  // setMetaLookupByViewId,
                                  visibleCols,
                                  pgEnv,
                                  falcor,
                                  geoid
                              }) {
    const metaViewIdLookupCols = formsConfig.attributes?.filter(md => visibleCols.includes(md.name) && md.meta_lookup);
    if (metaViewIdLookupCols?.length) {
        const data =
            await metaViewIdLookupCols.reduce(async (acc, md) => {
                    const prev = await acc;
                    const metaLookup = typeof md.meta_lookup === 'string' ? JSON.parse(md.meta_lookup) : md.meta_lookup;
                    const options = JSON.stringify({
                        aggregatedLen: metaLookup.aggregatedLen,
                        filter: {
                            ...metaLookup?.geoAttribute && {[`substring(${metaLookup.geoAttribute}::text, 1, ${geoid?.toString()?.length})`]: [geoid]},
                            ...(metaLookup?.filter || {})
                        }
                    });
                    const attributes = metaLookup.attributes;
                    const keyAttribute = metaLookup.keyAttribute;

                    const lenPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'length'];

                    const lenRes = await falcor.get(lenPath);
                    const len = get(lenRes, ['json', ...lenPath], 0);

                    if (!len) return Promise.resolve();

                    const dataPath = ['dama', pgEnv, 'viewsbyId', metaLookup.view_id, 'options', options, 'databyIndex'];
                    const dataRes = await falcor.get([...dataPath, {from: 0, to: len - 1}, attributes]);
                    const data = Object.values(get(dataRes, ['json', ...dataPath], {}))
                        .reduce((acc, d) => {
                            acc[d[keyAttribute]] = attributes.reduce((acc, attr) => {
                                acc[attr] = d[attr]
                                return acc
                            }, {})
                            return acc;
                        }, {})



                    return {...prev, ...{[md.name]: data}};
                }, {});
        // setMetaLookupByViewId({...metaLookupByViewId, ...data});

        return data
    }

    return {}
}

const filterData = ({geoAttribute, geoid, data, actionType}) =>
    data.filter(d => {
            return !geoAttribute ||
                actionType === 'shmp' ||
                d[geoAttribute] == geoid ||
                (geoid?.toString()?.length === 2 && d[geoAttribute]?.substring(0, 2) == geoid) // todo: geofilters should move to data call
        }
    );

export async function setMeta({
                                  formsConfig,
                                  visibleCols,
                                  openOutCols,
                                  data,
                                  metaLookupByViewId,
                                  geoAttribute, geoid,
                                  actionType,
                                  fn, form
                              }) {

    const metaLookupCols = formsConfig.attributes?.filter(md =>  visibleCols.includes(md.name) && md.meta_lookup);
    if (metaLookupCols?.length) {
        const dataWithMeta = filterData({
            geoAttribute: getColAccessor(fn, geoAttribute, formsConfig.attributes?.find(attr => attr.name === geoAttribute)?.origin, form),
            geoid,
            data,
            actionType
        })
            .map(row => {
                metaLookupCols.forEach(mdC => {
                    const currentMetaLookup = typeof mdC.meta_lookup === 'string' ? JSON.parse(mdC.meta_lookup) : mdC.meta_lookup;
                    const modifiedName = fn[mdC.name] && fn[mdC.name].includes('data->') ? fn[mdC.name] :
                        fn[mdC.name] && !fn[mdC.name].includes('data->') && fn[mdC.name].toLowerCase().includes(' as ') ?
                            fn[mdC.name].replace(mdC.name, `${getAccessor(mdC.name, form)}'${mdC.name}'`) :
                            fn[mdC.name] && !fn[mdC.name].includes('data->') && !fn[mdC.name].toLowerCase().includes(' as ') ?
                                `${fn[mdC.name].replace(mdC.name, `${getAccessor(mdC.name, form)}'${mdC.name}'`)} as ${mdC.name}` :
                                `${getAccessor(mdC.name, form)}'${mdC.name}' as ${mdC.name}`;


                    if (currentMetaLookup?.view_id) {
                        const {valueAttribute = 'name'} = currentMetaLookup;
                        const currentViewIdLookup = metaLookupByViewId?.[mdC.name] || [];
                        const currentRawValue = row[modifiedName];
                        if (currentRawValue?.includes(',')) {
                            row[modifiedName] = currentRawValue.split(',')
                                                                .reduce((acc, curr) =>
                                                                    [...acc,
                                                                        currentViewIdLookup?.[curr?.trim()]?.[valueAttribute] || curr]
                                                                    , [])//.join(', ')
                        } else {
                            row[modifiedName] = currentViewIdLookup?.[row[modifiedName]]?.[valueAttribute] || row[modifiedName];
                        }
                    } else {
                        row[modifiedName] = currentMetaLookup?.[row[modifiedName]] || row[modifiedName];
                    }
                })
                return row;
            })
        return handleExpandableRows(
            dataWithMeta,
            formsConfig.attributes,
            openOutCols,
            visibleCols.map(vc => ({
                name: vc,
                accessor: getColAccessor(fn, vc, formsConfig.attributes?.find(attr => attr.name === vc)?.origin, form)
            }))
        )
    } else {
        return handleExpandableRows(
            filterData({
                geoAttribute: getColAccessor(fn, geoAttribute, formsConfig.attributes?.find(attr => attr.name === geoAttribute)?.origin, form),
                geoid,
                data,
                actionType
            }),
            formsConfig.attributes,
            openOutCols,
            visibleCols.map(vc => ({
                name: vc,
                accessor: getColAccessor(fn, vc, formsConfig.attributes?.find(attr => attr.name === vc)?.origin, form)
            }))
        )
    }
}