import React from "react";
import get from "lodash/get.js";

export const ProcessDataForMap = (data=[]) => React.useMemo(() => {
    const years = [...new Set(data.map(d => d.year))];
    const nri_categories = new Set([]);

    const processed_data = years.map(year => {
        const lossData = data
            .filter(d => d.year === year)
            .reduce((acc, d) => {
                const nri_category = d.nri_category;
                const tmpDn = d.nri_category;
                const tmpPd = +d.fusion_property_damage || 0,
                    tmpCd =  +d.fusion_crop_damage || 0,
                    tmptd = tmpPd + tmpCd + (+d.swd_population_damage || 0);

                return {
                    ...acc, ...{
                        [`${tmpDn}_pd`]: (acc[[`${tmpDn}_pd`]] || 0) + tmpPd,
                        [`${tmpDn}_cd`]: (acc[`${tmpDn}_cd`] || 0) + tmpCd,
                        [`${tmpDn}_td`]: (acc[`${tmpDn}_td`] || 0) + tmptd,
                        [`${tmpDn}_nri_category`]: nri_category
                    }
                };
            }, {});
        return { year, ...lossData };
    });

    return { processed_data, nri_categories: [...nri_categories] };
}, [data]);

