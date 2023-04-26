import React from 'react'
import { NavLink, Link, useSubmit, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import DndList from './draggable'


const theme = {
  nav: {
    container: 'w-[264px] fixed z-0 hidden lg:block overflow-hidden',
    navItemContainer: 'h-full border-l pt-3',
    navItem: ({ isActive, isPending }) =>
      `block px-4 py-2 ml-2 font-light ${isActive ?
        'w-[256px] bg-white text-blue-500 border-l border-y' :
        'w-[248px] hover:bg-blue-100 text-slate-600'
      }`,
    navItemChild: ({ isActive, isPending }) =>
      `block px-4 py-2 font-light ${isActive ?
        'w-[238px] bg-white text-blue-500 border-l border-y' :
        'w-[230px] hover:bg-blue-100 text-slate-600'
      }`,
    addItemButton: 'cursor-pointer px-4 py-2 mt-3 hover:bg-blue-100 w-full text-slate-400 border-t border-slate-200'
  }
}

function getChildNav(item, dataItems,edit) {
  let children = dataItems
    .filter(d => d.parent === item.id)
    .sort((a,b) => a.index-b.index)

  if(children.length === 0) return ''

  // console.log('children', children)
  return children.map((d,i) =>
    <div key={i} className='border-l border-blue-200 ml-6'>  
      <NavLink
        key={i}
        to={`${edit ? '/edit' : ''}/${d.url_slug || d.id}`} 
        className={theme.nav.navItemChild}
      >
        {d.title} | {d.index}
      </NavLink>
      {getChildNav(d,dataItems,edit)}
    </div>
  )
  
}


let id = -1;
const makeId = () => `list-${ ++id }`;

const DraggableItem = ({ id, index, children }) =>
  <Draggable draggableId={ `draggable-${ id }` } index={ index }>
    { provided => (
        <div ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }>
        { children }
        </div>
      )
    }
  </Draggable>

  
export default function Nav({item,dataItems, edit}) {
  return (
    <>
      <div className={theme.nav.container}>
        <div className={theme.nav.navItemContainer}>
          <DndList>
            {dataItems
              .sort((a,b) => a.index-b.index)
              .filter(d => !d.parent)
              .map((d,i) => 
                <div key={i}>  
                  <NavLink
                    to={`${edit ? '/edit' : ''}/${i === 0 && !edit ? '' : d.url_slug || d.id}`} 
                    className={theme.nav.navItem}
                  >
                    {d.title} | {d.index}
                  </NavLink>
                  {getChildNav(d,dataItems,edit)}
                </div>
            )}
          </DndList>
          {edit && <AddItemButton dataItems={dataItems}/>}
        </div>
      </div>
      <div className='w-64 hidden lg:block'/>
    </>
  )
}

export  function NavDrag ({item, dataItems=[], edit}) {
  const onDragEnd = React.useCallback(result => {
    if (!result.destination) return;
    const start = result.source.index,
      end = result.destination.index;
    if (start === end) return;
    console.log('drag end', start, end)
  }, []);

  return ( 
    <>
    <div className={theme.nav.container}>
      <div className={theme.nav.navItemContainer}>
        <DragDropContext onDragEnd={ onDragEnd }>
          <Droppable droppableId={ makeId() } className="box-content">
            { 
              (provided, snapshot) => (
                <div ref={ provided.innerRef }
                  { ...provided.droppableProps }
                  className={ `flex flex-col
                    ${ snapshot.isDraggingOver ? theme.listDragging : theme.list }
                    
                  ` }>
                      {dataItems
                        .sort((a,b) => a.index-b.index)
                        .filter(d => !d.parent)
                        .map((d,i) => 
                          <DraggableItem key={ d.id } id={ d.id } index={ i }>
                            <div>  
                              <NavLink
                                to={`${edit ? '/edit' : ''}/${i === 0 && !edit ? '' : d.url_slug || d.id}`} 
                                className={theme.nav.navItem}
                              >
                                {d.title} | {d.index}
                              </NavLink>
                              {getChildNav(d,dataItems,edit)}
                            </div>
                          </DraggableItem>
                        )}
                      { provided.placeholder }
                </div>
              )
            }
          </Droppable>
        </DragDropContext>
      {edit && <AddItemButton dataItems={dataItems}/>}
      </div>
    </div>
    <div className='w-64 hidden lg:block'/>
    </>
  )
}

function AddItemButton ({dataItems}) {
  const submit = useSubmit()
  const { pathname = '/edit' } = useLocation()
  
  const highestIndex = dataItems
    .filter(d => !d.parent)
    .reduce((out,d) => {
      return Math.max(isNaN(d.index) ? -1 : d.index  , out)
    },-1)

  //console.log(highestIndex, dataItems)
  const item = {
    title: 'New Page',
    index: highestIndex + 1
  }
  item.url_slug = getUrlSlug(item,dataItems)

  const addItem = () => {
    submit(json2DmsForm(item), { method: "post", action: pathname })
  }
  return (
    <div className='pr-2'>
      <div 
        onClick={addItem}
        className={theme.nav.addItemButton}
      >
        + Add Page
      </div>
    </div>
  )
}

export const json2DmsForm = (data,requestType='update') => {
  let out = new FormData()
  out.append('data', JSON.stringify(data))
  out.append('requestType', requestType)
  //console.log(out)
  return out
}

const getParentSlug = (item, dataItems) => {
  if(!item.parent) {
    return ''
  }
  let parent = dataItems.filter(d => d.id === item.parent)[0]
  return `${parent.url_slug}/`
}

export const getUrlSlug = (item, dataItems) => {
  let slug =  `${getParentSlug(item, dataItems)}${toSnakeCase(item.title)}`

  if((item.url_slug && item.url_slug === slug) || !dataItems.map(d => d.url_slug).includes(slug)) {
    return slug
  }
  return `${slug}_${item.index}`
}

export const toSnakeCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');