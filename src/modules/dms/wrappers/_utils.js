import { getViewComp, getEditComp } from '../data-types'
import get from 'lodash/get'

export function getAttributes (format, options, mode='') {
	//
	const attributeFilter = get(options, 'attributes', [])
	// console.log('getAttributes', format.attributes)
	const attributes = format.attributes
		.filter(attr => attributeFilter.length === 0 || attributeFilter.includes(attr.key))
		.filter(attr => mode !== 'edit' || 
				(typeof attr.editable === 'undefined' ||
				!attr.editable === false)
		)
		.reduce((out,attr) => {
			out[attr.key] = attr
			return out
		},{})

	const attributeKeys = Object.keys(attributes)
		
	Object.keys(attributes)
		.filter(attributeKey => attributeKeys.includes(attributeKey))
		.map(attributeKey => {		
			attributes[attributeKey].ViewComp = getViewComp(
				get(attributes, `[${attributeKey}].type`, 'default')
			)
			attributes[attributeKey].EditComp = getEditComp(
				get(attributes, `[${attributeKey}].type`, 'default')
			)
		})

	return attributes
}