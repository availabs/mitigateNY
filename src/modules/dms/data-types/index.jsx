import React from 'react'
import text from './text'
import textarea from './textarea'
import boolean from './boolean'

import dmsFormat from './dms-format'
import Array from './array'

import get from 'lodash/get'

const DmsDataTypes = {
	'text': text,
	'datetime': text,
	'textarea': textarea,
	'boolean': boolean,
	'dms-format': dmsFormat,
	'default': text
}

export function registerDataType (name, dataType) {
	DmsDataTypes[name] = dataType
}

export function getViewComp (attr) {
	const { type='default', isArray=false, attributes } = attr
	let Comp = get(DmsDataTypes, `[${type}]`, DmsDataTypes['default'])
	return isArray ? 
		(props) => <Array.ViewComp Component={Comp} {...props} attr={attr} /> :
		Comp.ViewComp
}

export function getEditComp (attr) {
	const { type='default', isArray=false, attributes } = attr
	console.log('get EditComp attr:', attr)
	let Comp = get(DmsDataTypes, `[${type}]`, DmsDataTypes['default'])
	return isArray ? 
		(props) => <Array.EditComp Component={Comp} {...props} attr={attr} /> :
		Comp.EditComp
}


export default DmsDataTypes