import React, {useState} from "react";
import {Table} from "~/modules/avl-components/src";
import {fnum} from "~/utils/macros.jsx";
import {Attribution} from "../../../components/attribution.jsx";
import {RenderExternalTableFilter} from "../../../components/externalTableFilter.jsx";

const colAccessNameMapping = {
    'disaster_number': 'distinct disaster_number as disaster_number',
}

const getNestedValue = (obj) => typeof obj?.value === 'object' ? getNestedValue(obj.value) : obj?.value || obj;


export const RenderBuildingsTable = ({
                                         data = [],
                                         columns = [],
                                         filterValue = {},
                                         extFilterValues = {},
                                         setExtFilterValues,
                                         pageSize,
                                         sortBy = {},
                                         baseUrl,
                                         attributionData,
                                         striped,
                                         fetchData,
                                         hiddenCols
                                     }) => {
    const [filters, setFilters] = useState(extFilterValues);

    const updatedColumns = columns
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
                if (typeof value === 'object') return <div></div>
                return (<div>{value}</div>);
            }
        }
    })
    const sortColRaw = updatedColumns.find(c => c.accessor === Object.keys(sortBy)?.[0])?.accessor;

    const filteredData = data.filter(row =>
        !Object.keys(filterValue || {}).length ||
        Object.keys(filterValue)
            .reduce((acc, col) => {
                const value = getNestedValue(row[col]);
                return acc && value?.toString().toLowerCase().includes(filterValue[col]?.toLowerCase())
            }, true)
    )
        .filter(row => !Object.keys(filters)?.length ||
            Object.keys(filters)
                .filter(f => filters[f].length)
                .reduce((acc, col) => {
                    const currentCol = columns.find(c => c.accessor === col);
                    const originalValue = currentCol.openOut ? row.expand.find(r => r.accessor === col) : row[col];
                    const value = getNestedValue(originalValue);
                    return acc && filters[col].includes(value);
                }, true)
        )
    return (
        <>
            <RenderExternalTableFilter
                columns={columns.filter(c => c.extFilter)}
                data={data}
                filters={filters}
                setFilters={setFilters}
                setExtFilterValues={setExtFilterValues}
            />
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
            <Attribution baseUrl={baseUrl} attributionData={attributionData}/>
        </>
    )
};