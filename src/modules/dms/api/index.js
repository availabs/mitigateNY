import { falcor } from '~/main'
//import { useFalcor } from '~/modules/avl-falcor'
import { getActiveConfig, getParams, filterParams } from '../dms-manager/utils'
import { redirect } from "react-router-dom";
import get from 'lodash/get'


export async function dmsDataLoader ( config, path='/') {
	const { app , type } = config.format
	const activeConfigs = getActiveConfig(config.children, path)
	const activeConfig = activeConfigs[0] || {} //
	// console.log('dmsDataLoader', activeConfig, path, activeConfigs)
	const attributeFilter = get(activeConfig,'options.attributes', [])

	
	let params = activeConfig.params

	//console.log('dmsDataLoader', activeConfig, params, 'path:',path)
	
	const lengthReq = ['dms', 'data', `${ app }+${ type }`, 'length' ]
  	const length = get(await falcor.get(lengthReq), ['json',...lengthReq], 0)
  	const itemReq = ['dms', 'data', `${ app }+${ type }`, 'byIndex'] 

  	
  	// console.log('dmsApiController - path, params', path, params)
  	// console.log('falcorCache', JSON.stringify(falcor.getCache(),null,3))
  	
  	const data = length ? Object.values(get(
  		await falcor.get([
			...itemReq, 
			{from: 0, to: length-1}, 
			["id", "data", "updated_at", "created_at"] //"app", "type",
		]), 
  		['json', ...itemReq],
  		{}
  	))
  	.filter(d => d.id)
  	.map(d => {
  		// flatten data into single object
  		d.data.id = d.id
  		d.data.updated_at = d.updated_at
  		d.data.created_at = d.created_at
  		
  		/* 
  		   if the config has attributes filter
  		   only select listed attributes
  		   otherwise send all attributes
  		*/
  		return attributeFilter.length ? 
  		attributeFilter.reduce((out, attr) => {
  			out[attr] = d.data[attr]
  			return out
  		},{}) : 
  		d.data
  	}) : []
  	
  	//console.log('data', data, activeConfig)
  	return data 
  	// switch (activeConfig.action) {
  	// 	case 'list': 
  	// 		return data
  	// 	case 'view':
  	// 		return data.filter(d => filterParams(d,params))
  	// 	case 'edit':
  	// 		return data.filter(d => filterParams(d,params))
  	// 	default:
  	// 		return data
  	// }
}

export async function dmsDataEditor ( config, data, path='/' ) {
	const { app , type } = config.format
	const { id } = data
	const attributeKeys = Object.keys(data)
		.filter(k => !['id', 'updated_at', 'created_at'].includes(k))

	const activeConfig = getActiveConfig(config.children, path)
	

	const updateData = attributeKeys.reduce((out,key) => {
		out[key] = data[key]
		return out
	},{})
	
	console.log('dmsDataEditor', id, attributeKeys, updateData)

	if(id && attributeKeys.length > 0) {
		/*  if there is an id and data 
		    do update               
		*/

		// todo - data verification 
		
		let update = await falcor.call(["dms", "data", "edit"], [id, data]);
		return {message: "Update successful."}
	} else if ( attributeKeys.length > 0 ) {
		/*  if there is only data 
		    create new                
		*/
		
      	// to do - data verification

      	let newData = await falcor.call(
      		["dms", "data", "create"], 
      		[app, type, data]
      	);
      	console.log('newData', newData)
      	return redirect(activeConfig.redirect || '/')
	}

	return { message: "Not sure how I got here."}

} 