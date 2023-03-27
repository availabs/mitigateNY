// import SectionDisplayComp from "./components/SectionDisplayComp"
//import Table from '~/modules/dms/components/table'
import { NavLink, Link } from "@remix-run/react";
//import AuthMenu from '~/modules/auth/AuthMenu'


const pageSection = {
  app: "dms-remix",
  type: "page-section",
  // registerFormats: [pageElement],
  attributes: [
      { key: "title",
        type: "text"
      },
      {
        key: 'section',
        type: "text"
      },
      { key: "element",
        type: "type-select",
        attributes: [
          { key: "Draft Editor",
            type: "richtext"
          },
          { key: "Simple Text",
            type: "text"
          },
          { key: "Asset Table",
            type: "asset-table"
          },
          { key: "NFIP Table",
            type: "nfip-table"
          },
          { key: "Map",
            type: "map"
          }
        ]
      }

  ]
}

const page = {
  app: "dms-remix",
  type: "page",
  registerFormats: [pageSection],
  attributes: [
    { key: "title",
      type: "text"
    },
    { key: "section",
      type: "text",
      required: true,
      default: "props:section",
      hidden: true
    },
    { key: "sectionLanding",
      type: "boolean",
      default: false,
      editable: false,
      hidden: true
    },
    {
      key: "index",
      type: "number",
      default: "props:index",
      editable: false,
      hidden: true
    },
    { key: "title",
      type: "text"
    },
    {
      key: 'url-slug',
      type: "text"
    },
    {
      key: 'showSidebar',
      type: "boolean",
      default: true,
      required: true
    },
    // {
    //   key: 'sections',
    //   type: "dms-format",
    //   format: "meta+page-section",
    //   isArray: true,
    //   useOrdered: true,
    //   showControls: false,
    //   DisplayComp: SectionDisplayComp
    // }
  ]
}

const SiteLayout = ({children, user}) => (
  <div>
    <div className='flex p-2 text-gray-800 border-b w-full'>
      <NavLink to='/site' className='p-4'>Home</NavLink>
      {/*<div className='flex flex-1 justify-end '>
        <div>
          <AuthMenu user={user} />
        </div>
      </div>*/}
    </div>
    <div>{children}</div>
  </div>
)

const SiteAdmin = (props) => (
  <div>
    <div className='w-full p-4'>
      <Link to='/site/new' className='p-2 bg-blue-500 shadow text-gray-100'> New Page </Link>
    </div>
    <Table {...props} />
  </div>
)

const siteConfig = {
  format: page,
  children: [
    { 
      type: SiteLayout,
      action: 'list',
      path: '',
      children: [
        { 
          type: "dms-landing",
          action: 'list',
          path: 'list'
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: '',
          redirect: '/site'
        },
        { 
          type: 'dms-table',
          action: 'list',
          path: '',
          options: {
            attributes: [
              'id',
              'title',
              'bloggerId',
              'updated_at'
            ],
            columns: [
              { type: 'data',
                name: 'Id',
                path: "id",
              },
              { type: 'link',
                name: 'Title',
                text: ':title',
                to: '/site/page/:id',
                filter: "fuzzyText"
              },
              { type: 'date',
                name: 'Updated',
                path: "updated_at",
              },
              { type: 'link',
                name: '',
                to: '/site/edit/:id',
                text: "edit"
              }  
            ],
            filter: {
              args: ["self:data.replyTo"],
              comparator: arg1 => !Boolean(arg1),
              sortType: d => new Date(d).valueOf()
            }
          },

        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: 'edit',
          params: ['id']
        },
        { 
          type: "dms-card",
          path: 'page',
          action: 'view',
          params: ['id'],        
        },
      ]
    },     
    { 
      type: (props) => <div>Test Page</div>,
      path: 'test'
    }
  ]
}


export {
  siteConfig,
  page,
  pageSection
}
