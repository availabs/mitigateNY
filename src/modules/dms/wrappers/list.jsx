import React, {useEffect} from 'react'
import { useLoaderData, /*useActionData,*/ useParams } from "react-router-dom";
import { getParams, filterParams } from '../dms-manager/utils'
import { getAttributes } from './_utils'

export default function ListWrapper({ Component, format, options, ...props}) {
	const attributes = getAttributes(format,options)
	const { data, user } = useLoaderData()
	
	// console.log('ListWrapper', data)
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

	return (
		<div className='border border-green-300'>
			<div className='text-xs'>List Wrapper</div>
			<Component 
				{...props} 
				format={format}
				attributes={attributes}
				dataItems={data}
				options={options}
				user={user}
			/>
		</div>
	)	
}