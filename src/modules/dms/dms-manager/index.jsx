import React from 'react'
import comps from '../components'
import { getActiveView, validFormat } from './_utils'
import ThemeContext from '../theme'
import defaultTheme from '../theme/default-theme'

const { InvalidConfig, NoRouteMatch } = comps

const DmsManager = ({ config, path='', theme=defaultTheme }) => {
	// check for valid config
	if(!config.children || !validFormat(config.format)) {
		return <InvalidConfig config={config} />
	}

	// add default data to format
	// const enhancedFormat = React.useMemo(() => 
	// 	enhanceFormat(config.format)
	// ,[config.format])

	const RenderView = getActiveView(config.children, path, config.format, location)
	if(!RenderView) {
		return <NoRouteMatch path={path} />
	}

	return (
		<ThemeContext.Provider value={theme}>
			{RenderView}
		</ThemeContext.Provider>
	)	
}

export default DmsManager