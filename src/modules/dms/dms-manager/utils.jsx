import Wrappers from '../wrappers'
import Components from '../components'
import cloneDeep from 'lodash/cloneDeep'

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
	// config matcher for recursive config analysis
	const params = [...new Set(['', ...path.split('/')])]
	return [...config.filter(d => {
		// if the path is an exact match
		return (d.path === params[depth])   
			// or if there are no params at this depth
			// and there is a root config, use that config
			|| (typeof params[depth] === 'undefined' && d.path === '')
			// or if depth is zero (for now -- mayble always?) match against next depth
			// to allow routes to override root routes  
			|| (depth === 0 && d.path === params[depth+1])
	})
	// because these conditions may return multiple valid configs
	// sort for match with longest path
	// this allows root routes to be overriden
	.sort((a,b) => b.path.length - a.path.length)
	// the filter removes root routes from matching 
	// first level override routes
	.filter((d, i, arr) => arr.length === 1 || depth > 0  ||  (i == 0 && d.path !== '' ))]
}


export function getActiveConfig (config=[], path='/', depth = 0) {
	// console.log('test', config, 'path', path)
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