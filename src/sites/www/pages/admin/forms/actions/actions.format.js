
const cmsPageFormat = {
  app: "dms-site",
  type: "forms-actions-test",
  // defaultSearch: `data ->> 'index' = '0' and data ->> 'parent' = ''`,
  // defaultSort: (d) => d.sort((a,b) => a.index - b.index || a.parent-b.parent),
  attributes: [
    { key: "name",
      type: "text",
      required: true,
      default: "Unnamed Action"
    },
    { key: "type",
      type: "text",
    },
    { key: "description",
      type: "text",
    },
  ]
}

export default cmsPageFormat