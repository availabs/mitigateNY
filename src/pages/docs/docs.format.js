const docsPageFormat = {
  app: "dms-new",
  type: "docs-page",
  defaultSort: (d) => d.sort((a,b) => a.index - b.index),
  attributes: [
    { key: "title",
      type: "text",
      required: true,
      default: "New Page"
    },
    { key: "description",
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
      key: 'docs-content',
      type: 'lexical'
    }
  ]
}

export default docsPageFormat