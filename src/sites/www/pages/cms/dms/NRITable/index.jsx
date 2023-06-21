import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import {useFalcor} from '~/modules/avl-falcor';
import {pgEnv} from "~/utils/";
import {isJson} from "~/utils/macros.jsx";
import {RenderNRITable} from "./components/RenderNRITable.jsx";
import VersionSelectorSearchable from "../../components/versionSelector/searchable.jsx";
import GeographySearch from "../../components/geographySearch.jsx";
import {Loading} from "~/utils/loading.jsx";
import {RenderColumnControls} from "../../components/columnControls.jsx";
import {HazardSelector} from "../../components/hazardSelector.jsx";
import {metaData} from "./components/config.js";

const Edit = ({value, onChange}) => {
    const {falcor, falcorCache} = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 343;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 692);
    const [nriViewId, setnriViewId] = useState(cachedData?.nriViewId || 513);
    const [countyView, setCountyView] = useState();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36');
    const [filters, setFilters] = useState(cachedData?.filters || {});
    const [visibleCols, setVisibleCols] = useState(cachedData?.visibleCols || []);
    const [pageSize, setPageSize] = useState(cachedData?.pageSize || 5);
    const [sortBy, setSortBy] = useState(cachedData?.sortBy || {});
    const [hazard, setHazard] = useState(cachedData?.hazard);

    const nriGeoCol = `substring(stcofips, 1, ${geoid.length})`,
        nriAttributes = metaData.columns(hazard),
        anchorCols = [nriAttributes.find(a => a.value === 'stcofips')?.label],
        nriLenOptions =
            JSON.stringify({
                aggregatedLen: false,
                filter: {
                    [nriGeoCol]: [geoid],
                },
            }),
        nriOptions =
            JSON.stringify({
                filter: {
                    [nriGeoCol]: [geoid],
                }
            }),
        nriPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options"];

    const
        geoNamesOptions = JSON.stringify({
            ...geoid && { filter: { [`substring(geoid, 1, ${geoid?.length})`]: [geoid] } }
        }),
        geoNamesPath = view_id => ["dama", pgEnv, "viewsbyId", view_id, "options", geoNamesOptions];

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];

    useEffect(() => {
        async function getData() {
            if (!geoid) {
                setStatus('Please Select a Geography');
            } else {
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            setFilters({...filters,
                ...nriAttributes
                    .filter(c => c.filter)
                    .reduce((acc, curr) => ({...acc, [curr.label]: curr.filter}), {})}
            )

            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const nriView = deps.find(d => d.type === "nri");
                const countyView = deps.find(dep => dep.type === "tl_county");

                if (!nriView) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use nri data.')
                    return Promise.resolve();
                }

                setnriViewId(nriView.view_id)
                setCountyView(countyView.view_id);

                const geoNameLenRes = await falcor.get([...geoNamesPath(countyView.view_id), "length"]);
                const geoNameLen = get(geoNameLenRes, ["json", ...geoNamesPath(countyView.view_id), "length"], 0);

                if (geoNameLen) {
                    await falcor.get([...geoNamesPath(countyView.view_id), "databyIndex", {
                        from: 0,
                        to: geoNameLen - 1
                    }, ["geoid", "namelsad"]]);
                }


                const lenRes = await falcor.get([...nriPath(nriView.view_id), nriLenOptions, 'length']);
                const len = Math.min(get(lenRes, ['json', ...nriPath(nriView.view_id), nriLenOptions, 'length'], 0), 1000),
                    nriIndices = {from: 0, to: len - 1};

                await falcor.get(
                    [...nriPath(nriView.view_id), nriOptions, 'databyIndex', nriIndices, nriAttributes.map(v => v.value)],
                    ['dama', pgEnv, 'views', 'byId', nriView.view_id, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']]
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, hazard]);

    const geoNames = Object.values(get(falcorCache, [...geoNamesPath(countyView), "databyIndex"], {}));
    const  dataModifier = data => {
        data.map(row => {
            row.stcofips = geoNames?.find(gn => gn.geoid === row.stcofips)?.namelsad || row.stcofips;
        })
        return data
    };
    const data =
        useMemo(() =>
                Object.values(get(falcorCache,
                    [...nriPath(nriViewId), nriOptions, 'databyIndex'],
                    {})
                ),
            [falcorCache, nriViewId, nriOptions, nriAttributes, hazard]);
    dataModifier(data);

    const columns = nriAttributes
        .filter(col => visibleCols.includes(col.label) || anchorCols.includes(col.label))
        .map(col => {
            return {
                Header: col.label,
                accessor: col.value,
                align: col.align || 'right',
                width: col.width || '15%',
                filter: col.filter || filters[col.label],
                ...col
            }
        });

    const cols = metaData.columns(hazard);
    console.log('columns', cols)
    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', nriViewId, 'attributes'], {});

    useEffect(() => {
            if (!loading) {
                onChange(JSON.stringify(
                    {
                        attributionData,
                        ealViewId,
                        nriViewId,
                        status,
                        geoid,
                        pageSize, sortBy,
                        data, columns, filters, visibleCols, nriAttributes, hazard
                    }))
            }
        },
        [attributionData, status, ealViewId, nriViewId, geoid, pageSize, sortBy,
            data, columns, filters, visibleCols, nriAttributes, hazard]);
    console.log('state', filters, visibleCols, columns, data)
    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId}
                                               className={'flex-row-reverse'}/>
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'}/>
                    <HazardSelector hazard={hazard} setHazard={setHazard}/>
                    <RenderColumnControls
                        cols={nriAttributes.map(a => a.label)}
                        anchorCols={anchorCols}
                        visibleCols={visibleCols}
                        setVisibleCols={setVisibleCols}
                        filters={filters}
                        setFilters={setFilters}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>
                {
                    loading ? <Loading/> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                            <RenderNRITable
                                geoid={geoid}
                                data={data}
                                columns={columns}
                                pageSize={pageSize}
                                sortBy={sortBy}
                                attributionData={attributionData}
                                baseUrl={baseUrl}
                            />

                }
            </div>
        </div>
    )
}

Edit.settings = {
    hasControls: true,
    name: 'ElementEdit'
}

const View = ({value}) => {
    if (!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] :
        JSON.parse(value)
    return (
        <div className='relative w-full p-6'>
            {
                data?.status ?
                    <div className={'p-5 text-center'}>{data?.status}</div> :
                    <RenderNRITable {...data} baseUrl={'/'}/>
            }
        </div>
    )
}


export default {
    "name": 'Table: NRI',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}