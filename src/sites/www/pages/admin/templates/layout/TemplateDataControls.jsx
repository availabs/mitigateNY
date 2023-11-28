import React, {Fragment, useState, useEffect, useMemo} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { NavLink, Link } from "react-router-dom";
import {useFalcor} from '~/modules/avl-falcor';
import Selector from './Selector'
import get from 'lodash/get'
import {getAttributes} from '~/pages/DataManager/Source/attributes'
import ComponentRegistry from '~/sites/www/pages/cms/dms/ComponentRegistry'
import cloneDeep from "lodash/cloneDeep.js";
import {dmsDataEditor, dmsDataLoader} from "../../../../../../modules/dms/src/index.js";
import {getConfig, locationNameMap} from "../templatePages.jsx";

const pgEnv = 'hazmit_dama'

export default function DataControls ({item, dataItems,dataControls, setDataControls, open, setOpen, saveDataControls, baseUrl}) {
  const updateDataControls = (k,v) => {
    setDataControls({...dataControls, [k]: v})
  }

  // console.log('render data controls', dataControls)
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20 " onClose={()=> {setOpen(false); console.log('onclose');}}>
        <div className="fixed inset-x-0 bottom-0 top-12  overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 top-12 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Data Controls
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <i className="h-6 w-6 text-lg fa fa-close" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <span className='text-sm text-gray-500 p-1'>Select Template Source:</span>
                      <SourcesSelect 
                        value={dataControls.source}
                        onChange={(v) => {
                          console.log('SourcesSelect onChange', v)
                          updateDataControls('source', v)
                        }} 
                      />
                      <div onClick={(e) => saveDataControls()} className='p-2 cursor-pointer'> Save </div>
                      
                      {dataControls?.source?.source_id ? 
                        <ViewsSelect
                          source_id={dataControls?.source?.source_id}
                          value={dataControls.view}
                          onChange={(v) => {
                            updateDataControls('view', v)
                          }} 
                        /> : ''
                      }
                      {dataControls?.source?.source_id &&  
                       dataControls?.view?.view_id? 
                        <div>
                          <ViewInfo
                              item={item}
                            source={dataControls?.source}
                            view={dataControls?.view}
                            id_column={dataControls?.id_column}
                            active_row={dataControls?.active_row}
                            onChange={(k,v) => {
                              if(k === 'id_column') {
                                updateDataControls('id_column', v)
                                //updateDataControls('active_id','')
                                setDataControls({...dataControls, ...{id_column: v, active_row: {}}})
                              } 
                              if(k === 'active_row') {
                                //updateDataControls('active_id',v)
                                //console.log('active_id', v)
                                setDataControls({...dataControls, ...v})
                              }
                            }}
                            baseUrl={baseUrl}
                          />
                          <PathControl />
                          <SectionListControls 
                            sections={item.sections}
                            sectionControls={dataControls.sectionControls}
                            source={dataControls?.source}
                            onChange={e => {
                              updateDataControls('sectionControls', {...dataControls.sectionControls, ...e})
                            }}
                          />
                        </div> 
                        : ''
                      }

                      <div>
                        <pre>
                         {JSON.stringify(dataControls, null,3)}
                        </pre>
                      </div>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export const parseJSON = (d, fallback={}) => {
  let out = fallback
  try {
    out = JSON.parse(d)
  } catch (e) {
    //console.log('parse failed',d)
  }
  return out
}

const SectionThumb =({section,source,sectionControl={},updateSectionControl}) => {

  let data = parseJSON(section?.element?.['element-data']) || {}
  let type = section?.element?.['element-type'] || ''
  let comp = ComponentRegistry[type] || {}
  let controlVars = comp?.variables || []


  const attributes = React.useMemo(() => {
    
    let md = get(source, ["metadata", "columns"], get(source, "metadata", []));
    if (!Array.isArray(md)) {
      md = [];
    }

    return md.map(d => d.name)
      
  }, [source]);

  //console.log('section Thumb', data)

  
  return (
    <div className='p-4 border rounded mb-1'>
      
      <div>Title: {section?.title} {section?.id}</div>
      <div>{type}</div>
      <div>
        {controlVars
          .filter(k => !k.hidden)
          .map(k => {
          return (
            <div className='flex' key={k.name}>
              <div className='flex-1 items-center'>
                <div>{k.name}</div>
                <div className='text-xs'>{typeof data[k.name] === 'object' ? JSON.stringify(data[k.name]) : data[k.name]}</div>
              </div>
              <div className='flex-1 flex items-center'>
                <Selector
                  options={['',...attributes]}
                  value={sectionControl[k.name] || ''}
                  onChange={v => {
                    updateSectionControl({...sectionControl,...{[k.name]: v}})
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const SectionListControls = ({sections, sectionControls, source, onChange}) => {
  // console.log('SectionListControls',sectionControls)
  return (
    <div>
      {sections.map(s => (
        <SectionThumb 
          key={s.id}
          section={s} 
          source={source}
          sectionControl={sectionControls?.[s.id] || {}}
          updateSectionControl={(d) => {
            onChange({...sectionControls, ...{[s.id]: d}})
          }}
        />
      ))}
    </div>
  )
}

const PathControl = () => {
  return <div>Path...</div>
}

const SourcesSelect = ({value, onChange}) => {
   
  const { falcor, falcorCache } = useFalcor();
  
  useEffect(() => {
    async function fetchData() {
      const lengthPath = ["dama", pgEnv, "sources", "length"];
      const resp = await falcor.get(lengthPath);
      //console.log('length', get(resp.json, lengthPath, 0) - 1)
      const dataResp = await falcor.get([
        "dama", pgEnv, "sources", "byIndex",
        { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
        "attributes", ['source_id', 'name', 'metadata']
      ]);
      // console.log('dataResp', dataResp)
    }

    fetchData();
  }, [falcor, pgEnv]);

  const sources = useMemo(() => {
    //console.log('set sources', falcorCache)
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
  }, [falcorCache, pgEnv]);

  //console.log('sources select', sources)
  return (
     <Selector 
      options={['',...sources]}
      value={value}
      onChange={(v)=> onChange(v) }
    />
  );
};


const ViewsSelect = ({source_id, value, onChange}) => {
  
  const { falcor, falcorCache } = useFalcor();
  
  useEffect(() => {
    async function fetchData() {
      const lengthPath = ["dama", pgEnv, "sources", "byId", source_id, "views", "length"];;
      const resp = await falcor.get(lengthPath);
      // console.log('length', get(resp.json, lengthPath, 0) - 1)
      const dataResp = await falcor.get([
          "dama", pgEnv, "sources", "byId", source_id, "views", "byIndex",
          { from: 0, to: get(resp.json, lengthPath, 0) - 1 },
          "attributes", ['view_id', 'version']
        ]);
      //console.log('dataResp', dataResp)
    }

    fetchData();
  }, [falcor, pgEnv]);

  const views = useMemo(() => {
    return Object.values(get(falcorCache, ["dama", pgEnv, "sources", "byId", source_id, "views", "byIndex"], {}))
      .map(v => getAttributes(get(falcorCache, v.value, { "attributes": {} })["attributes"]));
  }, [falcorCache, source_id, pgEnv]);


  useEffect(() => {
    if(!value && views?.[0]?.view_id) {
      onChange(views?.[0])
    }
  },[views])
  


  // console.log('sources select', views)
  return (
     <Selector 
      options={['',...views]}
      value={value}
      nameAccessor={d => d?.version }
      onChange={(v)=> onChange(v) }
    />
  );
};

export const ViewInfo = ({item, source,view, id_column, active_row, onChange}) => {
  
  // console.log('ViewInfo', id_column, active_id)
  const { falcor, falcorCache } = useFalcor();
  const [generatedPages, setGeneratedPages] = useState([]);
  const [generatedSections, setGeneratedSections] = useState([]);

  //const [idCol, setIdCol] = useState('')
  React.useEffect(() => {
      // get generated pages and sections
      (async function () {
          const pages = await Object.keys(locationNameMap).reduce(async (acc, type) => {
              const prevPages = await acc;
              const currentPages = await dmsDataLoader(getConfig({app: 'dms-site', type, filter: {[`data->>'template_id'`]: [item.id]}}), '/');

              return [...prevPages, ...currentPages];
          }, Promise.resolve([]));
          setGeneratedPages(pages);

          if(!item.data_controls.sectionControls) return;

          const sectionIds = pages.map(page => page.data.value.sections.map(section => section.id));
          const sections = await sectionIds.reduce(async (acc, sectionId) => {
              const prevSections = await acc;
              const currentSections = await dmsDataLoader(
                  getConfig({
                      app: 'dms-site',
                      type: 'cms-section',
                      filter: {
                          [`data->'element'->>'template-section-id'`]: Object.keys(item.data_controls.sectionControls),
                          'id': sectionId // [] of ids
                      }
                  }), '/');

              return [...prevSections, ...currentSections];
          }, Promise.resolve([]));

          setGeneratedSections(sections);

          console.log('res', sections)
      })()
  }, [item.id, item.data_controls.sectionControls])
  React.useEffect(() => {
    if(view.view_id){
      falcor.get(["dama", pgEnv, "viewsbyId", view.view_id, "data", "length"])
    } 
  }, [pgEnv,  view.view_id]);

  const dataLength = React.useMemo(() => {
    return get(
      falcorCache,
      ["dama", pgEnv, "viewsbyId", view.view_id, "data", "length"],
      0
    );
  }, [pgEnv, view.view_id, falcorCache]);

  const attributes = React.useMemo(() => {
    
    let md = get(source, ["metadata", "columns"], get(source, "metadata", []));
    if (!Array.isArray(md)) {
      md = [];
    }

    return md
      
  }, [source]);

  React.useEffect(() =>{
    if(view?.view_id && id_column?.name && dataLength ) {
       falcor
        .get(
          [
            "dama",
            pgEnv,
            "viewsbyId",
            view.view_id,
            "databyIndex",
            {"from":0, "to": dataLength-1},
            attributes.map(d => d.name),
          ]
        )
    }
  },[id_column,view.view_id,dataLength])

  const dataRows = React.useMemo(()=>{
    return Object.values(get(falcorCache,[
      "dama",
      pgEnv,
      "viewsbyId",
      view.view_id,
      "databyIndex"
      ],{})).map(v => get(falcorCache,[...v.value],''))
  },[id_column,view.view_id,falcorCache])

  // console.log('view info', id_column, active_row, dataRows)
    // to update generated pages,check if:
    // 1. existing section has changed
    // 2. new sections have been added
    // 3. existing section has been deleted
   const generatePages = async ({id_column, dataRows}) => {
    // const disaster_numbers = ['4020', '4031']
    const idColAttr = dataRows.map(d => d[id_column.name]).filter(d => d).slice(0, 2);

     await idColAttr.reduce(async(acc, idColAttrVal) => {
       await acc;

       const dataControls = item.data_controls;
       let dataFetchers = Object.keys(dataControls.sectionControls)
           .filter(section_id => item.sections.find(s => s.id === section_id))
           .map(section_id => {
             let section = item.sections.filter(d => d.id === section_id)?.[0]  || {}
             let data = parseJSON(section?.element?.['element-data']) || {}
             let type = section?.element?.['element-type'] || ''
             let comp = ComponentRegistry[type] || {}
             let controlVars = (comp?.variables || []).reduce((out,curr) => {
               out[curr.name] = data[curr.name]
               return out
             },{})

             let updateVars = Object.keys(dataControls.sectionControls[section_id]) // check for id_col
                 .reduce((out,curr) => {
                   const attrName = dataControls?.sectionControls?.[section_id]?.[curr]?.name || dataControls?.sectionControls?.[section_id]?.[curr];

                   out[curr] = attrName === id_column.name ? idColAttrVal :
                       (
                           dataControls?.active_row?.[attrName] ||
                           dataControls?.active_row?.[attrName] ||
                           null
                       )
                   return out
                 },{})

             let args = {...controlVars, ...updateVars}
             // console.log('new args', controlVars, updateVars, args)
             return comp?.getData ? comp.getData(args,falcor).then(data => ({section_id, data})) : null
           }).filter(d => d)


       let updates = await Promise.all(dataFetchers)
       if(updates.length > 0) {
         let newSections = cloneDeep(item.sections)
         const sectionsToUpload = updates.map(({section_id, data}) => {
           let section = newSections.filter(d => d.id === section_id)?.[0]  || {}
           section.element['element-data'] = JSON.stringify(data);
           section.element['template-section-id'] = section_id; // to update sections in future
           delete section.id;
           // console.log('new section', section)
           return section;
         })

         // genetate
         const app = 'dms-site'
         const type = 'docs-play' // defaults to play
         const sectionType = 'cms-section'

         const sectionConfig = {format: {app, type: sectionType}};
         const pageConfig = {format: {app, type}};

         //create all sections first, get their ids and then create the page.
         const newSectionIds = await Promise.all(sectionsToUpload.map((section) => dmsDataEditor(sectionConfig, section)));

         const newPage = {
             template_id: item.id,
             hide_in_nav: 'true', // not pulling though?
           url_slug: `/${id_column.name}/${idColAttrVal}`,
           title: `generated by script for ${id_column.name} ${idColAttrVal}`,
           sections: newSectionIds.map(sectionRes => ({
             "id": sectionRes.id,
             "ref": "dms-site+cms-section"
           }))
         }
         const resPage = await dmsDataEditor(pageConfig, newPage);

         console.log('created', resPage)

       }

     }, Promise.resolve())
    }

    const updatePages = async ({id_column, dataRows}) => {
      console.log('update pages', generatedPages, generatedSections, item)
        // while updating existing sections, keep in mind to not change the id_column attribute.

     await generatedPages.reduce(async(acc, page) => {
       await acc;
        const sections = generatedSections.filter(section => page.data.value.sections.map(s => s.id).includes(section.id));
         console.log('page', page, sections)

       const dataControls = item.data_controls;

       let dataFetchers = Object.keys(dataControls.sectionControls)
           .filter(section_id => sections.find(s => s.data.value.element['template-section-id'] === section_id))
           .map(section_id => {
             let templateSection = item.sections.filter(d => d.id === section_id)?.[0]  || {};
             let pageSection = sections.find(s => s.data.value.element['template-section-id'] === section_id);
             let pageSectionData = parseJSON(pageSection?.data?.value?.element?.['element-data']) || {}

             let data = parseJSON(templateSection?.element?.['element-data']) || {}
             let type = templateSection?.element?.['element-type'] || ''
             let comp = ComponentRegistry[type] || {}

             console.log('section', templateSection, data, type)

             // update control variables
             let controlVars = (comp?.variables || []).reduce((out,curr) => {
               out[curr.name] = curr.name === id_column.name ? pageSectionData[curr.name] : data[curr.name]
               return out
             },{})

             // update
             let updateVars = Object.keys(dataControls.sectionControls[section_id]) // check for id_col
                 .reduce((out,curr) => {
                   const attrName = dataControls?.sectionControls?.[section_id]?.[curr]?.name || dataControls?.sectionControls?.[section_id]?.[curr];
                   console.log('updating attr', attrName, pageSectionData)
                   out[curr] = attrName === id_column.name ? pageSectionData[attrName] :
                       (
                           dataControls?.active_row?.[attrName] || null
                       )
                   return out
                 },{})

             let args = {...controlVars, ...updateVars}
             console.log('new args', controlVars, updateVars, args)
             return comp?.getData ? comp.getData(args,falcor).then(data => ({section_id, data, type})) : null
           }).filter(d => d)


       let updates = await Promise.all(dataFetchers)
         console.log('updates', updates)
       if(updates.length > 0) {
         let newSections = cloneDeep(sections)
           console.log('new sections ', newSections)
         const updatedSections = updates.map(({section_id, data, type}) => {
           let templateSection = item.sections.filter(d => d.id === section_id)?.[0]  || {};
           let pageSection = newSections.find(d => d.data.value.element['template-section-id'] === section_id)  || {};
           let section = pageSection?.data?.value;

           section.id = pageSection.id;
           section.title = templateSection.title;
           section.element['element-data'] = JSON.stringify(data);
           section.element['element-type'] = type;
           section.element['template-section-id'] = section_id; // to update sections in future
           // console.log('new section', section)
           return section;
         })
           console.log('updated sections', updatedSections)

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
    //      const newPage = {
    //          template_id: item.id,
    //          hide_in_nav: 'true', // not pulling though?
    //        url_slug: `/${id_column.name}/${idColAttrVal}`,
    //        title: `generated by script for ${id_column.name} ${idColAttrVal}`,
    //        sections: newSectionIds.map(sectionRes => ({
    //          "id": sectionRes.id,
    //          "ref": "dms-site+cms-section"
    //        }))
    //      }
    //      const resPage = await dmsDataEditor(pageConfig, newPage);
    //
    //      console.log('created', resPage)
    //
       }

     }, Promise.resolve())
    }


  return (
     <div className='flex flex-col'>
      {/*<div>View Info</div>*/}
      <div>Rows: {dataLength} </div>
      <div>Attributes : {attributes?.length || 0}</div>
        <Selector
          options={['',...attributes]}
          value={id_column}
          nameAccessor={d => d?.name}
          valueAccessor={d => d?.name}
          onChange={d => onChange('id_column',d)}
        />
        {id_column?.name ? 
        <Selector 
          options={dataRows}
          value={active_row}
          nameAccessor={d => d?.[id_column?.name] }
          onChange={d => onChange('active_row',{
              active_row:d
            }
          )}
        /> : ''}

         {
             generatedPages?.length ?
                 <button className={'mt-4 p-2 text-white bg-blue-500 hover:bg-blue-300 rounded-lg'}
                         onClick={e => updatePages({id_column, dataRows})}
                 >
                     Update Pages
                 </button> :
                 <button className={'mt-4 p-2 text-white bg-blue-500 hover:bg-blue-300 rounded-lg'}
                         onClick={e => generatePages({id_column, dataRows})}
                 >
                     Generate Pages
                 </button>
         }
     </div>
  );
};


