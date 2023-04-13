import React from 'react'
import comps from '../components'
import { 
	getActiveConfig, 
	getActiveView,
	processFormat,
	validFormat 
} from './_utils'
import ThemeContext from '../theme'
import defaultTheme from '../theme/default-theme'
import whiteTheme from '../theme/white-theme'

const { InvalidConfig, NoRouteMatch } = comps

const DmsManager = ({
	config, /* DMS config file */
	path='', /*  url path string  */
	theme=defaultTheme
}) => {
	// check for valid config
	if(!config.children || !validFormat(config.format)) {
		return <InvalidConfig config={config} />
	}
	
	// add default data to format
	// const enhancedFormat = React.useMemo(() => 
	// 	enhanceFormat(config.format)
	// ,[config.format])

	// console.log('dms-manager', config.children?.[0], path)
	// create component from config
	//console.log('formats', formats)
	const RenderView = getActiveView(config.children, path, config.format, location)
	if(!RenderView) {
		return <NoRouteMatch path={path} />
	}

	//console.log('RenderView', RenderView)

	return (
		<ThemeContext.Provider value={theme}>
			{RenderView}
		</ThemeContext.Provider>
	)	
}

export default DmsManager