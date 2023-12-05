import {dmsDataEditor} from "../../../../../../../modules/dms/src/index.js";
import {parseJSON} from "./parseJSON.js";
import ComponentRegistry from "../../../../cms/dms/ComponentRegistry.js";

export const updatePages = async ({item, id_column, generatedPages, generatedSections, falcor}) => {
    // while updating existing sections, keep in mind to not change the id_column attribute.

    await generatedPages.reduce(async(acc, page) => {
        await acc;
        const sections = generatedSections.filter(section => page.data.value.sections.map(s => s.id).includes(section.id));

        const dataControls = item.data_controls;

        let dataFetchers = item.sections.map(s => s.id)
            .map(section_id => {
                let templateSection = item.sections.find(d => d.id === section_id)  || {};
                let pageSection = sections.find(s => s.data.value.element['template-section-id'] === section_id);
                let pageSectionData = parseJSON(pageSection?.data?.value?.element?.['element-data']) || {}
                let data = parseJSON(templateSection?.element?.['element-data']) || {}
                let type = templateSection?.element?.['element-type'] || ''
                let comp = ComponentRegistry[type] || {}

                // update control variables
                let controlVars = (comp?.variables || []).reduce((out,curr) => {

                    out[curr.name] = curr.name === id_column.name ? page.data.value.id_column_value : data[curr.name]
                    return out
                },{})

                // update
                let updateVars = Object.keys(dataControls?.sectionControls?.[section_id] || {}) // check for id_col
                    .reduce((out,curr) => {
                        const attrName = dataControls?.sectionControls?.[section_id]?.[curr]?.name || dataControls?.sectionControls?.[section_id]?.[curr];

                        out[curr] = attrName === id_column.name ? page.data.value.id_column_value :
                            (
                                dataControls?.active_row?.[attrName] || null
                            )
                        return out
                    },{})

                let args = {...controlVars, ...updateVars}
                return comp?.getData ? comp.getData(args,falcor).then(data => ({section_id, data, type})) : null
            }).filter(d => d)


        let updates = await Promise.all(dataFetchers)

        if(updates.length > 0) {
            const updatedSections = item.sections
                .map(s => updates.find(u => u.section_id === s.id)) // to preserve order
                .filter(u => u)
                .map(({section_id, data, type}) => {
                let templateSection = item.sections.filter(d => d.id === section_id)?.[0]  || {};
                let pageSection = sections.find(d => d.data.value.element['template-section-id'] === section_id)  || {};
                let section = pageSection?.data?.value || {element:{}};

                if(pageSection?.id){
                    section.id = pageSection?.id; // to prevent creating new section
                }

                section.title = templateSection.title;
                section.level = templateSection.level;
                section.tags = templateSection.tags;
                section.element['element-data'] = JSON.stringify(data);
                section.element['element-type'] = type;
                section.element['template-section-id'] = section_id; // to update sections in future
                return section;
            })

            // genetate
            const app = 'dms-site'
            const type = 'docs-play' // defaults to play
            const sectionType = 'cms-section'

            const sectionConfig = {format: {app, type: sectionType}};
            const pageConfig = {format: {app, type}};

            //create all sections first, get their ids and then create the page.
            const newSectionIds = await Promise.all(updatedSections.map((section) => dmsDataEditor(sectionConfig, section)));

            // a page should only be updated IF sections have been added or removed. to check this, just compare section ids and template-section-ids.
            // any pageSection that has template-section-id (if it doesn't, it means it was added to the page after page generation and should be left alone)
            // should have a matching section id on the page. add or remove sections based on that.

            // loop over templatePAge sections, and arrange newSections in the same order except when an unknown section id appears in generated page
            // if(newSectionIds.find(nsi => nsi.id)){
                console.log('page', page, page.data.value.sections, newSectionIds, updatedSections)
                const newPage = {
                    id: page.id,
                    ...page.data.value,
                    sections: [
                        ...updatedSections.map(section => ({ // updatedSections contains correct order
                            "id": section.id,
                            "ref": "dms-site+cms-section"
                        })),
                        ...newSectionIds
                            .filter(s => s.id)
                            .map(sectionRes => ({
                                "id": sectionRes.id,
                                "ref": "dms-site+cms-section"
                            }))
                    ]
                }
                const resPage = await dmsDataEditor(pageConfig, newPage);
                console.log('created', resPage)
            // }
        }

    }, Promise.resolve())
}