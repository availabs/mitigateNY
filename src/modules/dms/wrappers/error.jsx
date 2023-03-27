import React, {useEffect} from 'react'
import {/* useFetcher, useLocation,*/ useLoaderData } from "react-router-dom";
import { getAttributes } from './_utils'

export default function ErrorWrapper({ Component, format, options, ...props}) {
	let attributes = getAttributes(format,options)
	// const { data, user } = useLoaderData()

	/*const { pathname } = useLocation()
	const fetcher = useFetcher();
	
	useEffect(() => {
		//console.log('fetch data', {...props})
    	fetcher.submit(
    		props.format,
    		{ 
    			method: "post", 
    		 	action: pathname === '/' ? 
    				'/splat' : pathname 
    		}
    	);
  	}, []);*/

	// console.log('DMS Error Wrapper ', props)
	return (
		<div className='border border-green-300'>
			<div className='text-xs'>Error Wrapper</div>
			<Component 
				{...props} 
				format={format}
				attributes={attributes}
				dataItems={[]}
				options={options}
				user={{}}
			/>
		</div>
	)	
}
