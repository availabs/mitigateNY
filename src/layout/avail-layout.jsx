import React from "react";
import { useTheme, TopNav, SideNav, FlyoutMenu } from "~/modules/avl-components/src/";
import { Link, Outlet } from "react-router-dom";
import AuthMenu from "~/pages/auth/AuthMenu"
//import {getDomain, getSubdomain} from "utils"
import get from 'lodash/get'


const dataManagerCats = {
	freightatlas: 'Freight Atlas'
}

const Logo = ({sideNav}) => {
	const theme = useTheme()
	const themeOptions = {size: get(sideNav, 'size','micro') ,color: get(sideNav, 'color','dark')}
	return (
		<>
			<Link to="/" className={`flex flex-col items-center justify-center`}>
				<div className='h-12 px-6 flex flex-col items-center justify-center'>
					AVAIL 
				</div>	
			</Link>
		</>
	)
}

let marginSizes = {
	none: '',
	micro: 'mr-14',
	mini: 'mr-20',
	compact: 'mr-44',
	full: 'mr-64'
}
let paddingSizes = {
	none: '',
	micro: 'pr-14',
	mini: 'pr-20',
	compact: 'pr-44',
	full: 'pr-64'
}


const Layout = ({ children, menus, sideNav={}, topNav={} }) => {
	const theme = useTheme()
	const sideNavOptions = {
		size: sideNav.size || 'none',
		color: sideNav.color || 'dark'
	}
	const topNavOptions = {
		position: topNav.position || 'block',
		size: topNav.size || 'compact',
		menu: topNav.menu || 'left',
		menuItems: topNav.menuItems || []

	}
	//console.log('test', theme.sidenav(themeOptions))

	return (
		<div className='flex' >
			{
				sideNavOptions.size === 'none' ? '' : (
					<div className={`hidden md:block ${marginSizes[sideNavOptions.size]}`}>
						<div className='fixed h-screen'>
							<SideNav 
								topMenu={<Logo sideNav={sideNavOptions}/>}
								themeOptions={sideNavOptions}
								menuItems={menus}
							/>
						</div>
					</div>
				)
			}
			<div className={`flex-1 flex items-start flex-col items-stretch min-h-screen`}>
				{
					topNavOptions.size === 'none' ? '' : (<>
						<div className={`${
							topNavOptions.position === 'fixed' ? 
								`fixed w-full z-20 ${paddingSizes[sideNavOptions.size]}` 
								: ''
							}`}>
							<TopNav
								themeOptions={topNavOptions}
								leftMenu={
									<div className='flex items-center justify-center h-12'>
										<div to="/" className={`${sideNavOptions.size === 'none' ? '' : 'md:hidden'}` }>
											<Logo sideNav={sideNavOptions}/>
										</div>
										
									</div>
								}
								menuItems={topNavOptions.menuItems}
								rightMenu={<AuthMenu />}
								
							/>
						</div>
						{topNavOptions.position !== 'fixed' ? '' :
							<div className='pb-12' ></div>
						}
					</>)
				}
				<div className={`h-full flex-1 bg-neutral-100 `}>
					{children}
				</div>
			</div>
		</div>
	);
};

export default Layout;