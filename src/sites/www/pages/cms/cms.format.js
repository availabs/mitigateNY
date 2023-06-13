import SectionArray from './components/sectionArray'

const cmsSection = {
  app: "dms-site",
  type: "cms-section",
  attributes: [
    { key: "title",
      type: "text",
      required: false,
      default: "Untitled Section"
    },
    { key: "tags",
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
  type: "docs-page",
  registerFormats: [cmsSection],
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
    }
  ]
}

export default cmsPageFormat