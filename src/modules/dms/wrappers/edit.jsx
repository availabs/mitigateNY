import React, {useEffect} from 'react'
import { useLoaderData, useActionData, useParams, Form } from "react-router-dom";
import { filterParams } from '../dms-manager/_utils'
import { getAttributes } from './_utils'
import get from 'lodash/get'

export default function EditWrapper({ Component, format, options, params, ...props}) {
	const attributes = getAttributes(format, options, 'edit')
	const { data, user } = useLoaderData()
	let status = useActionData()

	const [item, setItem] = React.useState(
		data.filter(d => filterParams(d,params))[0] 
		|| {}
	)

	useEffect(() => {
		//on click to route params is o
		setItem(data.filter(d => filterParams(d,params))[0] || {})
	},[params])

	const updateAttribute = (attr, value) => {
		setItem({...item, [attr]: value })
	}

	return (
		<div >
			{/*<div className='text-xs'>Edit Wrapper</div>*/}
			{/*<pre>{JSON.stringify(format,null,3)}</pre>*/}
			<Form method='post'>
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
			</Form>
		</div>
	)	
} 