import React, {useEffect, useMemo, useState} from "react";
import get from "lodash/get";
import { useFalcor } from '~/modules/avl-falcor';
import { pgEnv } from "~/utils/";
import { isJson } from "~/utils/macros.jsx";
import { RenderDisasterLossTable } from "./components/RenderDisasterLossTable.jsx";
import VersionSelectorSearchable from "../versionSelector/searchable.jsx";
import GeographySearch from "../geographySearch/index.jsx";
import DisasterSearch from "../DisasterSearch/index.jsx";
import { Loading } from "~/utils/loading.jsx";
import {fnum} from "~/utils/macros.jsx";
import {metaData} from "./config.js";
import {cellFormat} from './utils.jsx'
import {RenderColumnControls} from "./components/RenderColumnControls.jsx";

const Edit = ({value, onChange}) => {
    const { falcor, falcorCache } = useFalcor();

    let cachedData = value && isJson(value) ? JSON.parse(value) : {};
    const baseUrl = '/';

    const ealSourceId = 229;
    const [ealViewId, setEalViewId] = useState(cachedData?.ealViewId || 599);
    const [disasterNumber, setDisasterNumber] = useState(cachedData?.disasterNumber || 4420);
    const [countyView, setCountyView] = useState();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(cachedData?.status);
    const [geoid, setGeoid] = useState(cachedData?.geoid || '36001');
    const [type, setType] = useState(cachedData?.type || 'ihp');
    const [typeId, setTypeId] = useState(cachedData?.typeId);
    const [filters, setFilters] = useState(cachedData?.filters || {});

    const dependencyPath = (view_id) => ["dama", pgEnv, "viewDependencySubgraphs", "byViewId", view_id];
    const
        geoNamesOptions = JSON.stringify({
            ...geoid && { filter: { [`substring(geoid, 1, ${geoid?.length})`]: [geoid] } }
        }),
        geoNamesPath = view_id => ["dama", pgEnv, "viewsbyId", view_id, "options", geoNamesOptions];

    const attributionPath = ['dama', pgEnv, 'views', 'byId', ealViewId, 'attributes', ['source_id', 'view_id', 'version', '_modified_timestamp']];

    const geoOptions = JSON.stringify(metaData[type].options(disasterNumber, geoid)),
        geoPath = (view_id) => ["dama", pgEnv, "viewsbyId", view_id, "options"];

    useEffect( () => {
        async function getData(){
            if(!geoid){
                setStatus('Please Select a Geography');
            }else{
                setStatus(undefined)
            }
            setLoading(true);
            setStatus(undefined);
            return falcor.get(dependencyPath(ealViewId)).then(async res => {

                const deps = get(res, ["json", ...dependencyPath(ealViewId), "dependencies"]);

                const countyView = deps.find(dep => dep.type === "tl_county");
                setCountyView(countyView.view_id);

                const geoNameLenRes = await falcor.get([...geoNamesPath(countyView.view_id), "length"]);
                const geoNameLen = get(geoNameLenRes, ["json", ...geoNamesPath(countyView.view_id), "length"], 0);

                if (geoNameLen) {
                    const geoNameRes = await falcor.get([...geoNamesPath(countyView.view_id), "databyIndex", {
                        from: 0,
                        to: geoNameLen - 1
                    }, ["geoid", "namelsad"]]);
                }

                const typeId = deps.find(dep => dep.type === metaData[type]?.type);

                if(!typeId) {
                    setLoading(false)
                    setStatus('This component only supports EAL versions that use Fusion data.')
                    return Promise.resolve();
                }
                setTypeId(typeId.view_id);

                const lenRes = await falcor.get([...geoPath(typeId.view_id), geoOptions, 'length']);
                const len = Math.min(get(lenRes, ['json', ...geoPath(typeId.view_id), geoOptions, 'length'], 0), 100),
                    indices = { from: 0, to: len - 1 };
                if(!len) setLoading(false);

                await falcor.get(
                    [...geoPath(typeId.view_id), geoOptions, 'databyIndex', indices, Object.values(metaData[type].attributes(geoid))],
                    attributionPath
                );

                setLoading(false);
            })
        }

        getData()
    }, [geoid, ealViewId, disasterNumber, type]);

    const attributionData = get(falcorCache, ['dama', pgEnv, 'views', 'byId', ealViewId, 'attributes'], {});

    const geoNames = Object.values(get(falcorCache, [...geoNamesPath(countyView), "databyIndex"], {}));
    const  dataModifier = data => {
        data.map(row => {
            row.geoid = geoNames?.find(gn => gn.geoid === row.geoid)?.namelsad || row.geoid;
        })
        return data
    };
    let data = Object.values(get(falcorCache, [...geoPath(typeId), geoOptions, 'databyIndex'], {}));
    console.log('data?', data, falcorCache, [...geoPath(typeId), geoOptions, 'databyIndex'])
    metaData[type].mapGeoidToName && dataModifier && dataModifier(data);

    let columns = Object.keys(metaData[type].attributes(geoid))
        .map((col, i) => {
            const mappedName = metaData[type].attributes(geoid)[col];
            return {
                Header:  col,
                accessor: mappedName,
                align: metaData[type].textCols?.includes(col) ? 'left' : 'right',
                filter: (i === 0 && 'text') || filters[col]
            }
        })

    useEffect(() => {
            if(!loading){
                onChange(JSON.stringify(
                    {
                        ealViewId,
                        status,
                        geoid,
                        attributionData,
                        disasterNumber,
                        data, columns, filters, type, typeId
                    }))
            }
        },
        [status, ealViewId, geoid, attributionData, disasterNumber, data, columns, filters, type, typeId]);

    return (
        <div className='w-full'>
            <div className='relative'>
                <div className={'border rounded-md border-blue-500 bg-blue-50 p-2 m-1'}>
                    Edit Controls
                    <VersionSelectorSearchable source_id={ealSourceId} view_id={ealViewId} onChange={setEalViewId} className={'flex-row-reverse'} />
                    <GeographySearch value={geoid} onChange={setGeoid} className={'flex-row-reverse'} />
                    <DisasterSearch
                        view_id={ealViewId}
                        value={disasterNumber}
                        geoid={geoid}
                        onChange={setDisasterNumber}
                        className={'flex-row-reverse'}
                    />
                    <div className='flex justify-between'>
                        <label className={'shrink-0 pr-2 py-1 my-1'}>Select Type:</label>
                        <select
                            className='w-full shrink my-1 p-2 bg-white rounded-md'
                            onChange={e => setType(e.target.value)}
                            value={type}
                        >
                            {
                                Object.keys(metaData)
                                    .map(key => <option value={key}>{key}</option>)
                            }
                        </select>
                    </div>
                    <RenderColumnControls
                        cols={Object.keys(metaData[type].attributes(geoid))}
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>
                {
                    loading ? <Loading /> :
                        status ? <div className={'p-5 text-center'}>{status}</div> :
                                <RenderDisasterLossTable
                                    data={data}
                                    columns={columns}
                                    title={type}
                                    type={type}
                                    attributionData={attributionData}
                                    baseUrl={'/'}
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
    if(!value) return ''

    let data = typeof value === 'object' ?
        value['element-data'] : 
        JSON.parse(value)
    return (
        <div className='relative w-full p-6'>
            {
                data?.status ?
                    <div className={'p-5 text-center'}>{data?.status}</div> :
                    <RenderDisasterLossTable {...data} baseUrl={'/'}/>
            }
        </div>
    )           
}


export default {
    "name": 'Disaster Loss Tables',
    "type": 'Table',
    "EditComp": Edit,
    "ViewComp": View
}