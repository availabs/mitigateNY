import React, {useMemo} from "react";
import get from "lodash/get";
import {Link} from "react-router-dom";
import {Table} from "~/modules/avl-components/src";
import { fnum } from "~/utils/macros.jsx";
import {hazardsMeta} from "~/utils/colors.jsx";
import {Attribution} from "../../../components/attribution.jsx";

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const getNestedValue = (obj) => typeof obj?.value === 'object' ? getNestedValue(obj.value) : obj?.value || obj;

export const RenderDisastersTable = ({ type, data=[], columns=[], pageSize, sortBy = {}, disasterNames, baseUrl, attributionData, geoid, striped }) => {
    const updatedColumns = columns.map(c => {
        const col = c.rawHeader;
        const Header = c.Header;
        return {
            ...c,
            Cell: cell => {
                let value = getNestedValue(cell.value);
                value = Header === "Disaster Number" ?
                    get(disasterNames.find(dns => dns[colAccessNameMapping.disaster_number] === value),
                        "declaration_title", "No Title") + ` (${value})` :
                    Header === 'NRI Category' ?
                        (value || []).map(h => hazardsMeta[h]?.name || h).join(', ') :
                        value;
                value =
                    ['Geoid', 'Year', 'Event Id', 'Disaster Number', 'Hazard Type', 'NRI Category', 'Deaths, Injuries'].includes(Header) ?
                        value :
                        fnum(value || 0, true)

                return Header === "Disaster Number" ?
                    <Link to={`/disaster/${cell.row.original.disaster_number}/geography/${geoid}`}>
                        {value}
                    </Link> :
                    <div>
                        {value}
                    </div>;
            }
        }
    })
    const sortColRaw = updatedColumns.find(c => c.Header === Object.keys(sortBy)?.[0])?.accessor;
    return (
        <>
            <div className={'py-5'}>
                <label key={"nceiLossesTitle"} className={"text-lg capitalize"}> {type} Disasters </label>
                {
                    data?.length > 0 && columns?.length > 0 && (
                        <Table
                            columns={updatedColumns}
                            data={data}
                            initialPageSize={pageSize}
                            pageSize={pageSize}
                            striped={striped}
                            sortBy={sortColRaw}
                            sortOrder={Object.values(sortBy)?.[0] || 'asc'}
                        />
                    )
                }
            </div>
            <Attribution baseUrl={baseUrl} attributionData={attributionData} />
        </>
    )
};