import SectionArray from '../../cms/layout/sectionArray'

const cmsSection = {
  app: "dms-site",
  type: "cms-section",
  attributes: [
    { key: "title",
      type: "text",
      required: false,
      default: "Untitled Section"
    },
    { key: "level",
      type: "select",
      required: false,
      default: "h1"
    },
    { key: "tags",
      type: "text",
      required: false
    },
    { key: "requirements",
      type: "text",
      required: false
    },
    {
      key: "size",
      type: "text"
    },
    { key: "element",
      type: "selector",
      required: false,
    }
  ] 
}


const cmsPageFormat = {
  app: "dms-site",
  type: "docs-play",
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
      key: 'sections',
      type: 'dms-format',
      isArray: true,
      format: 'dms-site+cms-section',
      DisplayComp: SectionArray
    },
  ]
}

export default cmsPageFormat