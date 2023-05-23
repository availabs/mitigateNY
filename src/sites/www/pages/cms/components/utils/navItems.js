const baseUrl =''

function getChildNav(item, dataItems, edit ) {
  let children = dataItems
    .filter(d => item.id && d.parent === item.id)
    .sort((a,b) => a.index-b.index)

  if(children.length === 0) return false

  console.log('children', children, item.id, dataItems.map(d => d.parent))
  return children.map((d,i) => {
    let item  = {
      path: `${edit ? `${baseUrl}/edit` : baseUrl}/${d.url_slug || d.id}`,
      name: d.title
    }
    if(getChildNav(item,dataItems)) {
      item.children = getChildNav(d,dataItems, edit)
    }
    return item
  })
  
}

export function dataItemsNav (dataItems, edit = false) {
	console.log('dataItemsNav', dataItems)
  return  dataItems
    	.sort((a,b) => a.index-b.index)
    	.filter(d => !d.parent)
   	 	.map((d,i) => {
	      	let item = {
		      path: `${edit ? `${baseUrl}/edit` : baseUrl}/${i === 0 && !edit ? '' : d.url_slug || d.id}`,
		      name: d.title
		    }
    
	    	if(getChildNav(item,dataItems)) {
	        	item.children = getChildNav(d,dataItems, edit)
	    	}
    	 	
    		return item
   		})
}