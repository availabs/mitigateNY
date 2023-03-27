import React, {useEffect} from 'react'
import {/* useFetcher, useLocation,*/ useLoaderData } from "react-router-dom";
import { getAttributes } from './_utils'


export default function ViewWrapper({ Component, format, options, ...props}) {
	let attributes = getAttributes(format,options)
	const { data, user } = useLoaderData()

	return (
		<div className='border border-green-300'>
			<div>View Wrapper</div>
			<Component 
				{...props} 
				format={format}
				attributes={attributes}
				item={data[0]}
				options={options}
				user={user}
			/>
		</div>
	)	
}