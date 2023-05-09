import Wrappers from '../wrappers'
import Components from '../components'
import { matchRoutes } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'

const DefaultComponent = Components.devinfo
const DefaultWrapper = Wrappers.error
let childKey = 0


function configMatcher (config, path ) {
	
	// matchRoutes picks best from all available routes in config

	const matches = matchRoutes(config.map(d => ({path:d.path})), {pathname:path}) || []
	// console.log('configMatcher', config, matches, path)

	// hash matches by route path
	let matchHash = matches.reduce((out,c) => {
		out[c.route.path] = c
		return out
	},{})

	// return fitlered configs for best matches
	// and add extracted params from matchRoutes
	return config.filter((d,i) => {
		let match = matchHash?.[d.path] || false
		if(match){
			d.params = match.params
		}
		return match
	})
}


export function getActiveView(config, path, format, depth=0) {
	// add '' to params array to allow root (/) route  matching
	let activeConfigs = configMatcher(config,path)

	// console.log('activeConfigs', activeConfigs)
	// get the component for the active config
	// or the default component
	return activeConfigs.map(activeConfig => {
		const comp = typeof activeConfig.type === 'function' ?
			activeConfig.type :
			Components[activeConfig.type] || DefaultComponent
		
		// get the wrapper for the config, or the default wrapper
		//console.log('activeConfig Action',activeConfig.action)
		const Wrapper = Wrappers[activeConfig.action] || DefaultWrapper
		
		// if there are children 
		let children = []
		if(activeConfig.children) {
			children = getActiveView(activeConfig.children, path,format, depth+1)
		}

		//console.log('wrapper', activeConfig.action, activeConfig.type)
		return <Wrapper
			Component={comp}
			format={format}
			key={childKey++}
			{...activeConfig}
			children={children}
		/>
	})
}


export function getActiveConfig (config=[], path='/', depth = 0) {
	
	let configs = cloneDeep(configMatcher(config,path, depth))
	
	configs.forEach(out => {
		out.children = getActiveConfig(out.children, path, depth+1)
	})
	return configs || []
}



export function validFormat(format) {
	return format && 
		format.attributes && 
		format.attributes.length > 0
}


/*
export function enhanceFormat(format) {
	let out  = {...format}
	// console.log('enhance')
	if(out.attributes.filter(d => d.key ==='updated_at').length === 0){
		out.attributes.push({key: 'updated_at', type:'datetime', editable: false})
		out.attributes.push({key: 'created_at', type:'datetime', editable: false})
	}
	return out
}
*/


export function filterParams (data, params,format) {
	// filter data that has params
	// in params objects
	
	// let one attribute match wildcard * 
	let wildKey = format?.attributes?.reduce((out,attr) => {
		if(attr.matchWildcard){
			out = attr.key
		}
		return out
	},'') || ''

	// console.log('filterParams', data, params, wildKey)
	
	let filter = false
	Object.keys(params).forEach(k => {
		if(data[k] == params[k] || data[wildKey] === params['*']) {
			filter = true
		} else {
			filter = false
		}
	})
	return filter
}