import SectionArray from '../../cms/layout/sectionArray'
import { cmsSection } from '../../cms/cms.format.js'

const cmsPageFormat = {
  app: "dms-site",
  type: "format-page",
  registerFormats: [cmsSection],
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