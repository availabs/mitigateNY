import SectionArray from '../../cms/layout/sectionArray'
import {cmsSection} from '../../cms/cms.format.js'



const cmsPageFormat = {
  app: "dms-site",
  type: "docs-draft",
  registerFormats: [cmsSection],
  defaultSearch: `data ->> 'index' = '0' and data ->> 'parent' = ''`,
  defaultSort: (d) => d.sort((a,b) => a.index - b.index || a.parent-b.parent),
  attributes: [
    { key: "title",
      type: "text",
      required: true,
      default: "New Page"
    },
    {
      key: "show_in_nav",
      type: "text",
      default: "true"
    },
    {
      key: "index",
      type: "number",
      default: "props:index",
      editable: false,
      hidden: true
    },
    {
      key: "parent",
      type: "text",
      default: "",
      editable: false,
      hidden: true
    },
    {
      key: 'url_slug',
      type: "text",
      matchWildcard: true,
      hidden: true
    },
    {
      key: 'sidebar',
      type: "text",
      hidden: true
    },
    {
      key: 'sections',
      type: 'dms-format',
      isArray: true,
      format: 'dms-site+cms-section',
      DisplayComp: SectionArray
    },
  ]
}

export default cmsPageFormat