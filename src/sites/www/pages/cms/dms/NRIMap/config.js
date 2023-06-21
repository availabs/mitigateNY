export const metaData = {
    title: function (hazard, attribute, consequence){
        const conseq = Object.keys(this.consequences).find(k => this.consequences[k] === consequence);
        const attr = Object.keys(this.attributes).find(k => this.attributes[k] === attribute);
        return `NRI ${hazard} ${conseq || ``} ${attr}`
    },
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
    ]
};