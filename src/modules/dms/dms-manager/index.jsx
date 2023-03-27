import React from 'react'
import { InvalidConfig, NoRouteMatch } from './messages'
import { getActiveConfig, getActiveView, validFormat, enhanceFormat } from './utils'
import ThemeContext from '../theme'
import defaultTheme from '../theme/default-theme'
//import whiteTheme from '../theme/white-theme'

const DmsManager = ({
	config, /* DMS config file */
	path='', /*  url path string  */
	theme=defaultTheme
}) => {
	// check for valid config
	if(!config.children || !validFormat(config.format)) {
		return <InvalidConfig config={config} />
	}
	
	// get active config from path
	//const activeConfig = getActiveConfig(config.children, path)

	// add default data to format
	// const enhancedFormat = React.useMemo(() => 
	// 	enhanceFormat(config.format)
	// ,[config.format])

	console.log('dms-manager', config.children?.[0])
	// create component from config
	const RenderView = getActiveView(config.children, path, config.format)
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