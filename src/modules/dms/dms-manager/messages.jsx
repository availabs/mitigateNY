import React from 'react'

export function InvalidConfig ({config}) {
	return (
		<div> Invalid DMS Config : 
			<pre style={{background: '#dedede'}}>
				{JSON.stringify(config,null,3)} 
			</pre>
		</div>
	)
}

export function NoRouteMatch ({path}) {
	return (
		<div> These aren't the droids you are looking for 
			<div className='text-5xl'>
				404
			</div>
			<div>/{path}</div>
		</div>
	)
}