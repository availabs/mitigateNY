import Wrappers from '../wrappers'
import Components from '../components'
import { matchRoutes } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'

const DefaultComponent = Components.devinfo
const DefaultWrapper = Wrappers.error


export function filterParams (data, params) {
	// filter data that has params
	// in params objects
	let filter = false
	Object.keys(params).forEach(k => {
		if(data[k] == params[k]) {
			filter = true
		} else {
			filter = false
		}
	})
	return filter
}

function configMatcher (config, path, depth ) {
	console.log('configMatcher', config,path, depth)
	// matchRoutes picks best  
	const matches = matchRoutes(config.map(d => ({path:d.path})), {pathname:path}) || []
	
	
	let matchHash = matches.reduce((out,c) => {
		out[c.route.path] = c
		return out
	},{})

	// console.log('matchHash', matchHash)
	//let pathMatches = matches.map(d => d.route.path) 
	
	return config.filter((d,i) => {
		let match = matchHash?.[d.path] || false
		// console.log('match', match[0] ? true : false, d.path, match)
		if(match){
			//console.log('m',match)
			d.params = match.params
		}
		return match
	})
		
		
	
}


export function getActiveConfig (config=[], path='/', depth = 0) {
	
	let configs = cloneDeep(configMatcher(config,path, depth))
	
	configs.forEach(out => {
		out.children = getActiveConfig(out.children, path, depth+1)
	})
	return configs || []
}

export function getActiveView(config, path, format, depth=0) {
	//console.log('getActiveView', config, path)
	// add '' to params array to allow root (/) route  matching
	//console.log('p-d', path, depth, config)
	let activeConfigs = configMatcher(config,path,depth)

	//console.log('getActiveConfig', path, depth, activeConfigs?.[0], activeConfigs, activeConfigs.length)
	// get the component for the active config
	// or the default component
	return activeConfigs.map(activeConfig => {
		const comp = typeof activeConfig.type === 'function' ?
			activeConfig.type :
			Components[activeConfig.type] || DefaultComponent
		
		// get the wrapper for the config, or the default wrapper
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
			key={global.i++}
			{...activeConfig}
			children={children}
		/>
	})
}

export function validFormat(format) {
	return format && 
		format.attributes && 
		format.attributes.length > 0
}

export function enhanceFormat(format) {
	let out  = {...format}
	// console.log('enhance')
	if(out.attributes.filter(d => d.key ==='updated_at').length === 0){
		out.attributes.push({key: 'updated_at', type:'datetime', editable: false})
		out.attributes.push({key: 'created_at', type:'datetime', editable: false})
	}
	return out
}

export function getParams(params, path='') {
	if(!params || params.length === 0){
		return {}
	}
	const paths = path.split('/')
	return params.reduce((out, curr, i) => {
		out[curr] = paths[(i+1)]
		return out
	},{})
}