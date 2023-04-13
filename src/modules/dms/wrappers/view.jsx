import React, {useEffect} from 'react'
import {/* useFetcher, useLocation,*/ useLoaderData } from "react-router-dom";
import { filterParams } from '../dms-manager/_utils'
import { getAttributes } from './_utils'


export default function ViewWrapper({ Component, format, options, params, ...props}) {
	let attributes = getAttributes(format,options)
	const { data, user } = useLoaderData()

	//console.log('ViewWrapper', data)
	const item = data.filter(d => filterParams(d,params))[0] || data[0]


	return (
		<div /*className='border border-green-300'*/>
			{/*<div className='text-xs'>View Wrapper</div>*/}
			<Component 
				{...props} 
				format={format}
				attributes={attributes}
				item={item}
				options={options}
				user={user}
			/>
		</div>
	)	
}