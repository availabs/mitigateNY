//import Table from '~/modules/dms/components/table'
import { NavLink, Link } from "react-router-dom";
//import AuthMenu from '~/modules/auth/AuthMenu'

const BlogLayout = ({children, user}) => (
  <div>
    <div className='flex p-2 text-gray-800 border-b w-full'>
      <NavLink to='/blog' className='p-4'>Home</NavLink>
      <NavLink to='/blog/admin' className='p-4'>Admin</NavLink>
      {/*<div className='flex flex-1 justify-end '>
        <div>
          <AuthMenu user={user} />
        </div>
      </div>*/}
    </div>
    <div>{children}</div>
  </div>
)

const BlogAdmin = (props) => (
  <div>
    <div className='w-full'>
      <Link to='/blog/new' className='p-4 border'> New Post </Link>
    </div>
    <pre>
      {JSON.stringify(props,null,3)}
    </pre>
    {/*<Table {...props} />*/}
  </div>
)

const BLOG_POST = {
  app: "avl-website2",
  type: "blog-post",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "body",
      type: "richtext",
      required: true
    },
    { key: 'tags',
      type: 'text',
      isArray: true
    },
    { key: "url_slug",
      type: "text",
      required: false
    },
    { key: "bloggerId",
      name: "Blogger ID",
      type: "text",
      default: "props:user.id", // default value will be pulled from props.user.id
      editable: false
    },
    { key: "replyTo",
      name: "Reply To",
      type: "text",
      default: "props:blog-post.id", // default value will be pulled from props.blog-post.id
      editable: false
    }
  ]
}


const Blog = {
  format: BLOG_POST,
  children: [
    { 
      type: BlogLayout,
      action: 'list',
      path: '',
      msg: 'this is root',
      children: [
        { 
          type: "dms-landing",
          action: 'list',
          path: ''
        },
        { 
          type: 'dms-table',
          action: 'list',
          path: 'admin',
          options: {
            attributes: [
              'id',
              'title',
              'bloggerId',
              'updated_at'
            ],
            columns: [
              { type: 'link',
                name: 'Title',
                text: ':title',
                to: '/blog/post/:id',
                filter: "fuzzyText"
              },
              { type: 'data',
                name: 'Blogger',
                path: "bloggerId",
              },
              { type: 'date',
                name: 'Updated',
                path: "updated_at",
              },
              { type: 'link',
                name: '',
                to: '/blog/edit/:id',
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
          type: "dms-card",
          path: 'post',
          action: 'view',
          params: ['id'],
          options: {
            mapDataToProps: {
              title: "item:data.title",
              body: [
                "item:data.bloggerId",
                "item:data.body",
                "item:data.tags",
              ],
              footer: [
                "item:updated_at"
              ]
            },
          }
          
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: 'new',
          redirect: '/blog/admin'
        },
        { 
          type: "dms-edit",
          action: 'edit',
          path: 'edit',
          params: ['id']
        },
      ]
    },     
    // { 
    //   type: (props) => <div>Test Page 2</div>,
    //   path: 'test'
    // }
  ]
}

export default Blog