import React, {useEffect} from 'react'
import { useLoaderData, useActionData, useParams } from "react-router-dom";
import { getParams, filterParams } from '../dms-manager/utils'
import { getAttributes } from './_utils'
import get from 'lodash/get'

export default function EditWrapper({ Component, format, options, params, ...props}) {
	const attributes = getAttributes(format, options, 'edit')
	const {'*':path} = useParams()
	const pathParams = getParams(params, path)
	const { data, user } = useLoaderData()
	let status = useActionData()
	// console.log('EditWrapper',path, 'data', data.filter(d => filterParams(d,pathParams))[0])
	

	const [item, setItem] = React.useState(
		data.filter(d => filterParams(d,pathParams))[0] 
		|| {}
	)
	const updateAttribute = (attr, value) => {
		setItem({...item, [attr]: value })
	}

	return (
		<div className='border border-green-300'>
			<div className='text-xs'>Edit Wrapper</div>
			{/*<pre>{JSON.stringify(format,null,3)}</pre>*/}
			<form method='post'>
				<Component 
					{...props} 
					format={format}
					attributes={attributes}
					item={item}
					updateAttribute={updateAttribute}
					options={options}
					status={status}
					user={user}
				/>
				<input type="hidden" name="data" value={JSON.stringify(item)} />
			</form>
		</div>
	)	
} 