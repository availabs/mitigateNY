import React from "react";
import { useTheme, TopNav, SideNav, AwesomeTopNav } from "~/modules/avl-components/src/";
import { Link, Outlet } from "react-router-dom";
import AuthMenu from "~/pages/Auth/AuthMenu"
import MNYLogo from './mny-logo'
//import {getDomain, getSubdomain} from "utils"
import get from 'lodash/get'


const Logo = ({sideNav}) => {
	const theme = useTheme()
	const themeOptions = {size: get(sideNav, 'size','micro') ,color: get(sideNav, 'color','dark')}
	return (
		<>
			<Link to="/" className={`flex  border-b`}>
				<div className='h-12 pl-4 pr-2 flex items-center '>
					<MNYLogo height={35} width={170} />
				</div>	
			</Link>
		</>
	)
}

let marginSizes = {
	none: '',
	micro: 'mr-14',
	mini: 'mr-20',
	miniPad: 'mr-0',	
	compact: 'mr-44',
	full: 'mr-64'
}

let fixedSizes = {
	none: '',
	micro: 'w-14',
	mini: 'w-20',
	miniPad: 'w-0',
	compact: 'w-44',
	full: 'w-64'
}

let paddingSizes = {
	none: '',
	micro: 'pr-14',
	mini: 'pr-20',
	miniPad: 'pr-20',
	compact: 'pr-44',
	full: 'md:pr-64'
}



const Layout = ({ children, menus, sideNav={}, topNav={}, title }) => {
	const theme = useTheme()
	const sideNavOptions = {
		size: sideNav.size || 'none',
		color: sideNav.color || 'dark',
		menuItems: sideNav.menuItems || menus
	}
	const topNavOptions = {
		position: topNav.position || 'block',
		size: topNav.size || 'compact',
		menu: topNav.menu || 'left',
		subMenuStyle: topNav.subMenuStyle || 'row',
		menuItems: (topNav.menuItems || []).filter(page => !page.hideInNav),
		logo: topNav.logo || (
			<div className='flex items-center justify-center h-12'>
				<div to="/" className={`${['none'].includes(sideNavOptions.size)  ? '' : 'md:hidden'}` }>
					<Logo sideNav={sideNavOptions}/>
				</div>
				{title}
			</div>
		)
	}

	console.log('layout', topNav)
	
	return (
		<div className='flex' >
			{
				sideNavOptions.size === 'none' ? '' : (
					<div className={`hidden md:block ${marginSizes[sideNavOptions.size]}`}>
						<div className={`fixed h-screen ${fixedSizes[sideNavOptions.size]}`}>
							<SideNav 
								topMenu={<Logo sideNav={sideNavOptions}/>}
								themeOptions={sideNavOptions}
								menuItems={sideNavOptions.menuItems}
							/>
						</div>
					</div>
				)
			}
			<div className={`flex-1 flex items-start flex-col items-stretch min-h-screen w-full`}>
				{
					topNavOptions.size === 'none' ? '' : (<>
						<div className={`${
							topNavOptions.position === 'fixed' ? 
								`sticky top-0 z-20 w-full ` 
								: ''
							}`}>
								<TopNav
									themeOptions={topNavOptions}
									// subMenuActivate={'onHover'}
									leftMenu={topNavOptions.logo}
									menuItems={topNavOptions.menuItems}
									rightMenu={<AuthMenu />}
									
								/>
						</div>
					</>)
				}
				<div id={'content'} className={`h-full flex-1 bg-slate-100`}>

					{children}
				</div>
			</div>
		</div>
	);
};

export default Layout;