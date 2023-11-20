import React, {useMemo} from "react";
import get from "lodash/get";
import {Link} from "react-router-dom";
import {Table} from "~/modules/avl-components/src";
import { fnum } from "~/utils/macros.jsx";
import {hazardsMeta} from "~/utils/colors.jsx";
import {Attribution} from "../../../components/attribution.jsx";
import {getNestedValue, mapColName} from "../utils.js";


export const FormsTable = ({
                                       data=[],
                                       columns=[],
                                       hiddenCols=[],
                                       filterValue = {},
                                       pageSize,
                                       sortBy = {},
                                       baseUrl,
                                       attributionData,
                                       striped,
                                         fetchData
}) => {
    const updatedColumns =
        columns
            .filter(c => !hiddenCols.includes(c.name))
            .map(c => {
        return {
            ...c,
            Cell: cell => {
                let value = getNestedValue(cell.value);
                value =
                    ['integer', 'number'].includes(cell.column.type) ?
                        fnum(value || 0, c.isDollar) :
                        Array.isArray(value) ? value.join(', ') : value
                if(typeof value === 'object') return  <div></div>
                return( <div>{value}</div>);
            }
        }
    })
    const sortColRaw = updatedColumns.find(c => c.name === Object.keys(sortBy)?.[0])?.accessor;

    const filteredData = data.filter(row =>
        !Object.keys(filterValue || {}).length ||
        Object.keys(filterValue)
            .reduce((acc, col) => {
                const mappedName = mapColName(columns, col)
                const value = getNestedValue(row[mappedName]);
                return acc && value?.toString().toLowerCase().includes(filterValue[col]?.toLowerCase())
            }, true))

    return (
        <>
            <div className={'py-5'}>
                <Table
                    columns={updatedColumns}
                    data={filteredData}
                    initialPageSize={pageSize}
                    pageSize={pageSize}
                    striped={striped}
                    sortBy={sortColRaw}
                    sortOrder={Object.values(sortBy)?.[0] || 'asc'}
                    fetchData={fetchData}
                />
            </div>
            {/*<Attribution baseUrl={baseUrl} attributionData={attributionData} />*/}
        </>
    )
};