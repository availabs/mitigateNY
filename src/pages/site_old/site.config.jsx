// import SectionDisplayComp from "./components/SectionDisplayComp"
//import Table from '~/modules/dms/components/table'
import { NavLink, Link } from "react-router-dom";
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
      {
        key: 'content',
        type: "lexical"
      },
      
      // { key: "element",
      //   type: "type-select",
      //   attributes: [
      //     { key: "Draft Editor",
      //       type: "richtext"
      //     },
      //     { key: "Simple Text",
      //       type: "text"
      //     },
      //     { key: "Asset Table",
      //       type: "asset-table"
      //     },
      //     { key: "NFIP Table",
      //       type: "nfip-table"
      //     },
      //     { key: "Map",
      //       type: "map"
      //     }
      //   ]
      // }

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
    { key: "sectionLanding",
      type: "boolean",
      default: false,
      editable: false,
      hidden: true
    },
    {
      key: 'dms-section3',
      type: 'dms-format',
      isArray: true,
      format: 'dms-remix+page-section'
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
      required: true,
      hidden: true
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

const SiteLayout = ({children, user, dataItems}) => {
    return (
    <div>
      <div className='flex p-2 text-gray-800 border-b w-full'>
        {dataItems.map((d,i) => 
          <NavLink 
            key={i}
            to={`/${d.id}`} 
            className='p-4'
          >{d.title}</NavLink>)}
        <div className='flex-1' />
        <NavLink to='/admin' className='p-4'>Admin</NavLink>
        {/*<div className='flex flex-1 justify-end '>
          <div>
            <AuthMenu user={user} />
          </div>
        </div>*/}
      </div>
      <div>{children}</div>
    </div>
  )
}

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
      path: '/*',
      children: [
        { 
          type: "dms-landing",
          action: 'list',
          path: 'list'
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: '/admin',
          redirect: '/admin'
        },
        { 
          type: 'dms-table',
          action: 'list',
          path: '/admin',
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
                to: '/:id',
                filter: "fuzzyText"
              },
              { type: 'date',
                name: 'Updated',
                path: "updated_at",
              },
              { type: 'link',
                name: '',
                to: '/edit/:id',
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
          path: '/edit/:id',
          params: ['id']
        },
        { 
          type: "dms-card",
          path: '/:id?',
          action: 'view'
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
