import React, {useMemo} from "react";
import get from "lodash/get";
import {Link} from "react-router-dom";
import {Table} from "~/modules/avl-components/src";
import { fnum } from "~/utils/macros.jsx";

const colNameMapping = {
    swd_population_damage: 'Population Damage',
    fusion_property_damage: 'Property Damage',
    fusion_crop_damage: 'Crop Damage',
    total_fusion_damage: 'Total Loss',
    disaster_number: 'Disaster Number',
    event_id: 'Event Id',
    nri_category: 'Hazard Type',
    swd_ttd: 'Non Declared Total',
    ofd_ttd: 'Declared Total',
    geoid: 'Geoid',
    year: 'Year'
}

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const mapColName = col => colNameMapping[col.includes(' as ') ? col.split(' as ')[1] : col] || col;

export const RenderDisastersTable = ({ type, data, fusionAttributes, disasterNames, baseUrl, attributionData, geoid }) => {
    const columns = useMemo(() =>
        [fusionAttributes[1], fusionAttributes[2],  fusionAttributes[11],
            fusionAttributes[8], fusionAttributes[9], fusionAttributes[7], fusionAttributes[10]].map(col => {
            const mappedName = mapColName(col);
            return {
                Header:  mappedName,
                accessor: column => {
                    return mappedName === "Disaster Number" ?
                        get(disasterNames.find(dns => dns[colAccessNameMapping.disaster_number] === column[col]),
                            "declaration_title", "No Title") + ` (${column[col]})` : column[col];
                },
                Cell: cell => {
                    const value =
                        ['Year', 'Event Id', 'Disaster Number', 'Hazard Type'].includes(mappedName) ?
                            cell?.value?.value?.join(', ') || cell?.value :
                            fnum(cell.value, true)
                    return mappedName === "Disaster Number" ?
                        <Link to={`/disaster/${cell.row.original.disaster_number}/geography/${geoid}`}>
                            {value}
                        </Link> :
                        <div>
                            {value}
                        </div>;
                },
                align: ['Disaster Number', 'Year'].includes(mappedName) ? 'right' : 'left',
                width: mappedName === mapColName(fusionAttributes[1]) ? '10%' :
                    mappedName === mapColName(fusionAttributes[10]) ? '20%' :
                        mappedName === mapColName(fusionAttributes[11]) ? '20%' :
                            mappedName === mapColName(fusionAttributes[2]) ? '40%' :
                                '15%'
                ,
                filter: ['Disaster Number', 'Year'].includes(mappedName) && 'text'
            }
        }), [fusionAttributes, disasterNames, data]);

    return (
        <>
            <div className={'py-5'}>
                <label key={"nceiLossesTitle"} className={"text-lg capitalize"}> {type} Disasters </label>
                <Table
                    columns={columns}
                    data={data}
                    sortBy={mapColName(fusionAttributes[10])}
                    sortOrder={'desc'}
                    pageSize={5}
                    striped={false}
                />
            </div>
            <div className={'text-xs text-gray-700 pl-1'}>
                <Link to={`/${baseUrl}/source/${ attributionData?.source_id }/versions/${attributionData?.view_id}`}>
                    Attribution: { attributionData?.version }
                </Link>
            </div>
        </>
    )
};