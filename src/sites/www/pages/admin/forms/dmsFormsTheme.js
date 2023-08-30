function defaultTheme () {
	return {
		landing: {
			wrapper: 'p-4 border-2 border-blue-300'
		},
		table: {
			'table': 'min-w-full divide-y divide-gray-300',
			'thead': '',
			'th': 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900',
			'tbody': 'divide-y divide-gray-200 ',
			'td': 'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
		},
		text: {
			input: 'px-2 py-1 w-full text-sm font-light border focus:border-blue-300 focus:outline-none transition ease-in',
			view: 'text-sm font-light'
		},
		textarea: {
			input: 'px-2 py-1 w-full text-sm font-light border focus:border-blue-300 focus:outline-none transition ease-in',
			viewWrapper: 'overflow-hidden p-2'
		},
		select: {
			input: 'px-2 py-1 w-full text-sm font-light border focus:border-blue-300 bg-white hover:bg-gray-100 transition ease-in',
			error: 'text-xs text-red-300 font-light'
		},
		multiselect: {
			inputWrapper: 'flex px-2 py-1 w-full text-sm font-light border focus:border-blue-300 bg-white hover:bg-gray-100 transition ease-in',
			input: 'focus:outline-none w-full',
			tokenWrapper: 'flex px-2 py-1 mx-1 bg-gray-100 hover:bg-gray-300 rounded-md transition ease-in',
			removeIcon: 'fa fa-x px-1 text-xs text-red-300 hover:text-red-500 self-center transition ease-in',
			menuWrapper: 'p-2 shadow-lg z-10',
			menuItem: 'px-2 py-1 hover:bg-gray-300 hover:cursor-pointer transition ease-in',
			error: 'text-xs text-red-300 font-light'
		},
		radio: {
			wrapper: 'p-1 flex',
			input: 'self-center p-1',
			label: 'text-sm font-light p-1 self-center',
			error: 'text-xs text-red-300 font-light'
		},
		card: {
			wrapper: 'p-4',
			row: 'flex py-1 flex-col p-2 mt-3',
			rowLabel: 'w-full text-sm font-light mb-2 capitalize',
			rowContent: 'flex-1',
			rowHeader: 'w-full flex flex-row justify-between',
			infoIcon: 'p-2 fad fa-info text-blue-300 hover:text-blue-400'
		},
		form: {
			tabpanelWrapper: 'flex',
			tabWrapper: 'flex p-3 w-full',
			tabActive: 'w-full p-1 border-b-2 flex flex-col text-center border-blue-300 transition ease-in',
			tab: 'w-full p-1 border-b-2 flex flex-col text-center hover:bg-gray-300 transition ease-in',
			icon: '',
			tabTitle: 'text-xs font-bold',
			tabSubtitle: 'text-sm font-light',
			contentWrapper: 'flex'
		}
	}
}

export default defaultTheme()