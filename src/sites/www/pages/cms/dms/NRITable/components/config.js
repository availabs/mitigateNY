import {hazardsMeta} from "~/utils/colors.jsx";

export const metaData = {
    type: 'nri',
    attributes: {
        Frequency: 'afreq',
        Exposure: 'exp',
        EAL: 'eal'
    },
    consequences: {
        Buildings: 'b',
        Crop: 'a',
        Population: 'p',
        'Population $': 'pe',
        Total: 't'
    },
    dataSources: [
        {label: 'NRI Counties', value: 'nri_counties'},
        {label: 'AVAIL EAL Counties', value: 'avail_counties'}
    ],
    columns: function (hazard) {
        if (!hazard || hazard === 'total') return [];

        return [
            {value: 'stcofips', label: 'County', filter: 'text', width: '20%', isText: true},
            ...Object.keys(this.attributes)
                .reduce((accA, currA) => {
                    let template = {
                        value: `${hazardsMeta[hazard]?.prefix}_${this.attributes[currA]}`,
                        label: `${currA}`,
                        isDollar: false,
                    };

                    const cols = Object.keys(this.consequences)
                        .filter(c => hazardsMeta[hazard]?.consequences?.includes(this.consequences[c]))
                        .map(c => ({
                            value: `${template.value}${this.consequences[c]}`,
                            label: `${c} ${template.label}`,
                            isDollar: true
                        }))
                    return currA === 'Frequency' ? [...accA, template] : [...accA, ...cols];
                }, [])]
    }
};